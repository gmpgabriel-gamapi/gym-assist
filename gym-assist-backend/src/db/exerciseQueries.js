// [BACKEND] arquivo: src/db/exerciseQueries.js (MODIFICADO)
const db = require("./index");

const createCustomExercise = async ({
  name,
  ownerId,
  muscleGroupId,
  description, // --- ADIÇÃO ---
  videoUrl, // --- ADIÇÃO ---
}) => {
  const { rows } = await db.query(
    // --- MODIFICAÇÃO: Query atualizada para incluir os novos campos ---
    "INSERT INTO custom_exercises (name, owner_id, primary_muscle_group_id, description, video_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, ownerId, muscleGroupId, description, videoUrl]
  );
  return rows[0];
};

const findAllBase = async () => {
  const { rows } = await db.query(`
    SELECT 
      be.*,
      COALESCE(ARRAY_AGG(DISTINCT mg.id) FILTER (WHERE mg.id IS NOT NULL), '{}') AS muscle_group_ids
    FROM 
      base_exercises be
    LEFT JOIN 
      base_exercise_movements bem ON be.id = bem.base_exercise_id
    LEFT JOIN 
      movement_to_muscle mtm ON bem.movement_id = mtm.movement_id
    LEFT JOIN 
      muscles m ON mtm.muscle_id = m.id
    LEFT JOIN 
      muscle_subgroups msg ON m.muscle_subgroup_id = msg.id
    LEFT JOIN 
      muscle_groups mg ON msg.muscle_group_id = mg.id
    GROUP BY 
      be.id
    ORDER BY 
      be.name;
  `);
  return rows;
};

const findCustomByOwnerId = async (ownerId) => {
  const { rows } = await db.query(
    "SELECT * FROM custom_exercises WHERE owner_id = $1 ORDER BY name",
    [ownerId]
  );
  return rows;
};

const findCustomById = async (exerciseId) => {
  const { rows } = await db.query(
    "SELECT * FROM custom_exercises WHERE id = $1",
    [exerciseId]
  );
  return rows[0];
};

const updateCustomExercise = async (
  exerciseId,
  { name, muscleGroupId, description, videoUrl } // --- ADIÇÃO ---
) => {
  const { rows } = await db.query(
    // --- MODIFICAÇÃO: Query atualizada para incluir os novos campos ---
    "UPDATE custom_exercises SET name = $1, primary_muscle_group_id = $2, description = $3, video_url = $4 WHERE id = $5 RETURNING *",
    [name, muscleGroupId, description, videoUrl, exerciseId]
  );
  return rows[0];
};

const deleteCustomExercise = async (exerciseId) => {
  await db.query("DELETE FROM custom_exercises WHERE id = $1", [exerciseId]);
};

module.exports = {
  createCustomExercise,
  findAllBase,
  findCustomByOwnerId,
  findCustomById,
  updateCustomExercise,
  deleteCustomExercise,
};
