const db = require("./index");

const addMeasurement = async ({ userId, type, value, unit }) => {
  const { rows } = await db.query(
    "INSERT INTO user_measurements (user_id, measurement_type, value, unit) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, type, value, unit]
  );
  return rows[0];
};

// Esta função busca a medição MAIS RECENTE de cada tipo para um usuário
const findLatestMeasurementsByUserId = async (userId) => {
  const { rows } = await db.query(
    `SELECT DISTINCT ON (measurement_type) 
     id, user_id, measurement_type, value, unit, measured_at 
     FROM user_measurements 
     WHERE user_id = $1 
     ORDER BY measurement_type, measured_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = {
  addMeasurement,
  findLatestMeasurementsByUserId,
};
