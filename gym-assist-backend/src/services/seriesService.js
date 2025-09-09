const seriesQueries = require("../db/seriesQueries");

const createSeriesForUser = async (userId, seriesData) => {
  const { name, exercises } = seriesData;

  if (
    !name ||
    !exercises ||
    !Array.isArray(exercises) ||
    exercises.length === 0
  ) {
    throw {
      status: 400,
      message: "Nome da série e lista de exercícios são obrigatórios.",
    };
  }

  const newSeries = await seriesQueries.createSeries(userId, name, exercises);
  return newSeries;
};

const getSeriesForUser = async (userId) => {
  return seriesQueries.findSeriesByOwner(userId);
};

const getSeriesByIdForUser = async (seriesId, userId) => {
  const series = await seriesQueries.findSeriesById(seriesId, userId);
  if (!series) {
    throw {
      status: 404,
      message: "Série não encontrada ou pertence a outro usuário.",
    };
  }
  return series;
};

module.exports = {
  createSeriesForUser,
  getSeriesForUser,
  getSeriesByIdForUser,
};
