const seriesService = require("../services/seriesService");

const create = async (req, res) => {
  try {
    const newSeries = await seriesService.createSeriesForUser(
      req.user.id,
      req.body
    );
    res.status(201).json(newSeries);
  } catch (error) {
    console.error("Erro ao criar série:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const getAll = async (req, res) => {
  try {
    const series = await seriesService.getSeriesForUser(req.user.id);
    res.status(200).json(series);
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const getById = async (req, res) => {
  try {
    const series = await seriesService.getSeriesByIdForUser(
      req.params.id,
      req.user.id
    );
    res.status(200).json(series);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Erro interno do servidor" });
  }
};

module.exports = {
  create,
  getAll,
  getById,
};
