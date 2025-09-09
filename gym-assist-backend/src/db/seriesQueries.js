const db = require("./index");

const createSeries = async (ownerId, name, exercises) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    const seriesResult = await client.query(
      "INSERT INTO series (owner_id, name) VALUES ($1, $2) RETURNING id",
      [ownerId, name]
    );
    const seriesId = seriesResult.rows[0].id;

    const exerciseInsertPromises = exercises.map((ex) => {
      return client.query(
        "INSERT INTO series_exercises (series_id, base_exercise_id, custom_exercise_id, sets, reps, exercise_order) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          seriesId,
          ex.type === "base" ? ex.id : null,
          ex.type === "custom" ? ex.id : null,
          ex.sets,
          ex.reps,
          ex.order,
        ]
      );
    });
    await Promise.all(exerciseInsertPromises);

    await client.query("COMMIT");

    const createdSeries = { id: seriesId, name, owner_id: ownerId, exercises };
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
            s.id, 
            s.name, 
            s.notes,
            s.created_at,
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
                ) FILTER (WHERE se.id IS NOT NULL), '[]'::json
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
            s.owner_id = $1
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
        s.id, s.name, s.notes, s.created_at, s.owner_id,
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
            ) FILTER (WHERE se.id IS NOT NULL), '[]'::json
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
        s.id = $1 AND s.owner_id = $2
    GROUP BY 
        s.id;
  `;
  const { rows } = await db.query(query, [seriesId, ownerId]);
  return rows[0];
};

module.exports = {
  createSeries,
  findSeriesByOwner,
  findSeriesById,
};
