// [BACKEND] arquivo: src/db/seriesQueries.js (QUERY CORRIGIDA)
const db = require("./index");

const createSeries = async (ownerId, name, exercises) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    const seriesResult = await client.query(
      "INSERT INTO series (owner_id, name, is_active, version, parent_series_id) VALUES ($1, $2, true, 1, NULL) RETURNING *",
      [ownerId, name]
    );
    const seriesId = seriesResult.rows[0].id;
    if (exercises && exercises.length > 0) {
      const exerciseInsertPromises = exercises.map((ex, index) => {
        return client.query(
          "INSERT INTO series_exercises (series_id, base_exercise_id, custom_exercise_id, sets, reps, exercise_order) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            seriesId,
            ex.type === "base" ? ex.id : null,
            ex.type === "custom" ? ex.id : null,
            ex.sets,
            ex.reps,
            index,
          ]
        );
      });
      await Promise.all(exerciseInsertPromises);
    }
    await client.query("COMMIT");
    const createdSeries = seriesResult.rows[0];
    createdSeries.exercises = exercises || [];
    return createdSeries;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findSeriesByOwner = async (ownerId) => {
  const query = `
        SELECT 
            s.id, s.name, s.notes, s.created_at, s.owner_id, s.is_active, s.version, s.parent_series_id,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', COALESCE(be.id, ce.id),
                        'name', COALESCE(be.name, ce.name),
                        'type', CASE WHEN be.id IS NOT NULL THEN 'base' ELSE 'custom' END,
                        'sets', se.sets,
                        'reps', se.reps,
                        'order', se.exercise_order
                    ) ORDER BY se.exercise_order
                ) FILTER (WHERE se.id IS NOT NULL OR be.id IS NOT NULL OR ce.id IS NOT NULL), '[]'::json
            ) as exercises
        FROM 
            series s
        LEFT JOIN 
            series_exercises se ON s.id = se.series_id
        LEFT JOIN
            base_exercises be ON se.base_exercise_id = be.id
        LEFT JOIN
            custom_exercises ce ON se.custom_exercise_id = ce.id
        WHERE 
            s.owner_id = $1 AND s.is_active = true
        GROUP BY 
            s.id
        ORDER BY 
            s.created_at DESC;
    `;
  const { rows } = await db.query(query, [ownerId]);
  return rows;
};

const findSeriesById = async (seriesId, ownerId) => {
  const query = `
    SELECT 
        s.id, s.name, s.notes, s.created_at, s.owner_id, s.is_active, s.version, s.parent_series_id,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', COALESCE(be.id, ce.id),
                    'name', COALESCE(be.name, ce.name),
                    'type', CASE WHEN be.id IS NOT NULL THEN 'base' ELSE 'custom' END,
                    'sets', se.sets,
                    'reps', se.reps,
                    'order', se.exercise_order,
                    'lastLoad', '0kg'
                ) ORDER BY se.exercise_order
            ) FILTER (WHERE se.id IS NOT NULL OR be.id IS NOT NULL OR ce.id IS NOT NULL), '[]'::json
        ) as exercises
    FROM 
        series s
    LEFT JOIN 
        series_exercises se ON s.id = se.series_id
    LEFT JOIN
        base_exercises be ON se.base_exercise_id = be.id
    LEFT JOIN
        custom_exercises ce ON se.custom_exercise_id = ce.id
    WHERE 
        (s.id = $1 AND s.owner_id = $2) OR (s.id = $1 AND $2 IS NULL)
    GROUP BY 
        s.id;
  `;
  const { rows } = await db.query(query, [seriesId, ownerId]);

  // Vamos manter o log por enquanto para a validação final
  console.log(
    `[DEBUG] Resultado da Query CORRIGIDA findSeriesById para seriesId=${seriesId}:`,
    JSON.stringify(rows[0], null, 2)
  );

  return rows[0];
};

const hasExecutions = async (seriesId) => {
  const { rows } = await db.query(
    "SELECT 1 FROM executions WHERE series_id = $1 LIMIT 1",
    [seriesId]
  );
  return rows.length > 0;
};

const updateSeriesInPlace = async (seriesId, name, exercises) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE series SET name = $1 WHERE id = $2", [
      name,
      seriesId,
    ]);
    await client.query("DELETE FROM series_exercises WHERE series_id = $1", [
      seriesId,
    ]);
    if (exercises && exercises.length > 0) {
      const exerciseInsertPromises = exercises.map((ex, index) => {
        return client.query(
          "INSERT INTO series_exercises (series_id, base_exercise_id, custom_exercise_id, sets, reps, exercise_order) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            seriesId,
            ex.type === "base" ? ex.id : null,
            ex.type === "custom" ? ex.id : null,
            ex.sets,
            ex.reps,
            index,
          ]
        );
      });
      await Promise.all(exerciseInsertPromises);
    }
    await client.query("COMMIT");
    return { id: seriesId, name, exercises };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const createNewVersion = async (oldSeries, name, exercises) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE series SET is_active = false WHERE id = $1", [
      oldSeries.id,
    ]);
    const newVersion = oldSeries.version + 1;
    const parentId = oldSeries.parent_series_id || oldSeries.id;
    const newSeriesResult = await client.query(
      "INSERT INTO series (owner_id, name, is_active, version, parent_series_id) VALUES ($1, $2, true, $3, $4) RETURNING *",
      [oldSeries.owner_id, name, newVersion, parentId]
    );
    const newSeriesId = newSeriesResult.rows[0].id;
    if (exercises && exercises.length > 0) {
      const exerciseInsertPromises = exercises.map((ex, index) => {
        return client.query(
          "INSERT INTO series_exercises (series_id, base_exercise_id, custom_exercise_id, sets, reps, exercise_order) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            newSeriesId,
            ex.type === "base" ? ex.id : null,
            ex.type === "custom" ? ex.id : null,
            ex.sets,
            ex.reps,
            index,
          ]
        );
      });
      await Promise.all(exerciseInsertPromises);
    }
    await client.query("COMMIT");
    const createdSeries = newSeriesResult.rows[0];
    createdSeries.exercises = exercises || [];
    return createdSeries;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const softDeleteSeries = async (seriesId) => {
  const { rows } = await db.query(
    "UPDATE series SET is_active = false WHERE id = $1 RETURNING *",
    [seriesId]
  );
  return rows[0];
};

const hardDeleteSingleSeries = async (seriesId) => {
  await db.query("DELETE FROM series WHERE id = $1", [seriesId]);
};

const findInactiveVersions = async (parentId, ownerId) => {
  const query = `
        SELECT 
            s.id, s.name, s.version, s.created_at,
            COALESCE(json_agg(json_build_object('name', COALESCE(be.name, ce.name), 'sets', se.sets, 'reps', se.reps) ORDER BY se.exercise_order) FILTER (WHERE se.id IS NOT NULL), '[]'::json) as exercises
        FROM series s
        LEFT JOIN series_exercises se ON s.id = se.series_id
        LEFT JOIN base_exercises be ON se.base_exercise_id = be.id
        LEFT JOIN custom_exercises ce ON se.custom_exercise_id = ce.id
        WHERE (s.parent_series_id = $1 OR s.id = $1) AND s.owner_id = $2 AND s.is_active = false
        GROUP BY s.id
        ORDER BY s.version ASC;
    `;
  const { rows } = await db.query(query, [parentId, ownerId]);
  return rows;
};

const findArchivedSeriesHeads = async (ownerId) => {
  const query = `
        WITH active_families AS (
            SELECT DISTINCT COALESCE(parent_series_id, id) AS family_id
            FROM series
            WHERE owner_id = $1 AND is_active = true
        ),
        ranked_inactive AS (
            SELECT s.*, ROW_NUMBER() OVER(PARTITION BY COALESCE(s.parent_series_id, s.id) ORDER BY s.version DESC) as rn
            FROM series s
            WHERE s.owner_id = $1 AND s.is_active = false
        )
        SELECT ri.id, ri.name, ri.notes, ri.created_at, ri.owner_id, ri.version,
            COALESCE(json_agg(json_build_object('id', COALESCE(be.id, ce.id), 'name', COALESCE(be.name, ce.name), 'type', CASE WHEN be.id IS NOT NULL THEN 'base' ELSE 'custom' END, 'sets', se.sets, 'reps', se.reps, 'order', se.exercise_order) ORDER BY se.exercise_order) FILTER (WHERE se.id IS NOT NULL), '[]'::json) as exercises
        FROM ranked_inactive ri
        LEFT JOIN series_exercises se ON ri.id = se.series_id
        LEFT JOIN base_exercises be ON se.base_exercise_id = be.id
        LEFT JOIN custom_exercises ce ON se.custom_exercise_id = ce.id
        WHERE ri.rn = 1 AND COALESCE(ri.parent_series_id, ri.id) NOT IN (SELECT family_id FROM active_families)
        GROUP BY ri.id, ri.name, ri.notes, ri.created_at, ri.owner_id, ri.version;
    `;
  const { rows } = await db.query(query, [ownerId]);
  return rows;
};

const findSeriesContainingExercise = async (exerciseId) => {
  const query = `
        SELECT s.*,
            COALESCE(json_agg(json_build_object('id', COALESCE(be.id, ce.id), 'name', COALESCE(be.name, ce.name), 'type', CASE WHEN be.id IS NOT NULL THEN 'base' ELSE 'custom' END, 'sets', se.sets, 'reps', se.reps, 'order', se.exercise_order) ORDER BY se.exercise_order) FILTER (WHERE se.id IS NOT NULL), '[]'::json) as exercises
        FROM series s
        JOIN series_exercises se ON s.id = se.series_id
        LEFT JOIN base_exercises be ON se.base_exercise_id = be.id
        LEFT JOIN custom_exercises ce ON se.custom_exercise_id = ce.id
        WHERE s.is_active = true AND se.custom_exercise_id = $1
        GROUP BY s.id;
    `;
  const { rows } = await db.query(query, [exerciseId]);
  return rows;
};

module.exports = {
  createSeries,
  findSeriesByOwner,
  findSeriesById,
  hasExecutions,
  updateSeriesInPlace,
  createNewVersion,
  softDeleteSeries,
  hardDeleteSingleSeries,
  findInactiveVersions,
  findArchivedSeriesHeads,
  findSeriesContainingExercise,
};
