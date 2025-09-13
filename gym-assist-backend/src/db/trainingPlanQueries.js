// [BACKEND] arquivo: src/db/trainingPlanQueries.js (VERSÃO 100% COMPLETA)
const db = require("./index");

const findActivePlanByUserId = async (userId) => {
  const query = `
    SELECT
      tp.id,
      tp.user_id,
      tp.is_active,
      tp.created_at,
      tp.version,
      tp.parent_plan_id,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', s.id,
            'name', s.name,
            'notes', s.notes,
            'order_in_loop', tps.order_in_loop,
            'day_of_week', tps.day_of_week
          )
        ) FILTER (WHERE s.id IS NOT NULL), '[]'::json
      ) as series
    FROM
      training_plans tp
    LEFT JOIN
      training_plan_series tps ON tp.id = tps.training_plan_id
    LEFT JOIN
      series s ON tps.series_id = s.id
    WHERE
      tp.user_id = $1 AND tp.is_active = true
    GROUP BY
      tp.id;
  `;
  const { rows } = await db.query(query, [userId]);
  return rows[0];
};

const createInitialPlanForUser = async (userId) => {
  const { rows } = await db.query(
    "INSERT INTO training_plans (user_id) VALUES ($1) RETURNING *",
    [userId]
  );
  return rows[0];
};

const syncPlanSeries = async (planId, planConfig) => {
  const { mode, data } = planConfig;
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM training_plan_series WHERE training_plan_id = $1",
      [planId]
    );

    if (mode === "loop" && data && data.length > 0) {
      const insertPromises = data.map((seriesId, index) => {
        return client.query(
          "INSERT INTO training_plan_series (training_plan_id, series_id, order_in_loop) VALUES ($1, $2, $3)",
          [planId, seriesId, index + 1]
        );
      });
      await Promise.all(insertPromises);
    } else if (mode === "weekly" && data) {
      const daysOfWeek = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const insertPromises = Object.entries(data).map(([day, series]) => {
        if (series) {
          const dayIndex = daysOfWeek.indexOf(day);
          return client.query(
            "INSERT INTO training_plan_series (training_plan_id, series_id, day_of_week) VALUES ($1, $2, $3)",
            [planId, series.id, dayIndex]
          );
        }
        return Promise.resolve();
      });
      await Promise.all(insertPromises);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findActivePlanContainingSeries = async (seriesId) => {
  const { rows } = await db.query(
    `SELECT tp.*,
            COALESCE(
                json_agg(DISTINCT tps.series_id) FILTER (WHERE tps.series_id IS NOT NULL), '[]'::json
            ) as series_ids
         FROM training_plans tp
         JOIN training_plan_series tps ON tp.id = tps.training_plan_id
         WHERE tp.is_active = true AND tps.series_id = $1
         GROUP BY tp.id`,
    [seriesId]
  );
  return rows;
};

const hasExecutions = async (planId) => {
  const { rows } = await db.query(
    "SELECT 1 FROM executions WHERE training_plan_id = $1 LIMIT 1",
    [planId]
  );
  return rows.length > 0;
};

const createNewVersion = async (oldPlan, planConfig) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE training_plans SET is_active = false WHERE id = $1",
      [oldPlan.id]
    );
    const newVersion = oldPlan.version + 1;
    const parentId = oldPlan.parent_plan_id || oldPlan.id;
    const newPlanResult = await client.query(
      "INSERT INTO training_plans (user_id, is_active, version, parent_plan_id) VALUES ($1, true, $2, $3) RETURNING id",
      [oldPlan.user_id, newVersion, parentId]
    );
    const newPlanId = newPlanResult.rows[0].id;
    await syncPlanSeries(newPlanId, planConfig);
    await client.query("COMMIT");
    return findActivePlanByUserId(oldPlan.user_id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  findActivePlanByUserId,
  createInitialPlanForUser,
  syncPlanSeries,
  findActivePlanContainingSeries,
  hasExecutions,
  createNewVersion,
};
