const db = require("./index");

const findAll = async () => {
  const { rows } = await db.query("SELECT * FROM muscle_groups ORDER BY name");
  return rows;
};

module.exports = {
  findAll,
};
