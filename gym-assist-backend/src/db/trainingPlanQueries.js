const db = require("./index");

const findActivePlanByUserId = async (userId) => {
  const query = `
    SELECT
      tp.id as plan_id,
      tp.is_active,
      tp.created_at,
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

const syncPlanSeries = async (planId, seriesIds) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Deleta todas as associações antigas para este plano
    await client.query(
      "DELETE FROM training_plan_series WHERE training_plan_id = $1",
      [planId]
    );

    // 2. Insere as novas associações com a nova ordem
    const insertPromises = seriesIds.map((seriesId, index) => {
      return client.query(
        "INSERT INTO training_plan_series (training_plan_id, series_id, order_in_loop) VALUES ($1, $2, $3)",
        [planId, seriesId, index + 1]
      );
    });
    await Promise.all(insertPromises);

    await client.query("COMMIT");
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
};
