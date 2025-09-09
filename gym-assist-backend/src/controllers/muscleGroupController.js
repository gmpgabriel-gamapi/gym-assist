const muscleGroupQueries = require("../db/muscleGroupQueries");

const getAll = async (req, res) => {
  try {
    const muscleGroups = await muscleGroupQueries.findAll();
    res.status(200).json(muscleGroups);
  } catch (error) {
    console.error("Erro ao buscar grupos musculares:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

module.exports = {
  getAll,
};
