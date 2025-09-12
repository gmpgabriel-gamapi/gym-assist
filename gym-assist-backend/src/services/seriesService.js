// [BACKEND] arquivo: src/services/seriesService.js (MODIFICADO)
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
  return seriesQueries.createSeries(userId, name, exercises);
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

const updateSeriesForUser = async (seriesId, userId, seriesData) => {
  const { name, exercises } = seriesData;
  if (!name || !Array.isArray(exercises) || exercises.length === 0) {
    throw { status: 400, message: "Nome e exercícios são obrigatórios." };
  }
  const existingSeries = await seriesQueries.findSeriesById(seriesId, userId);
  if (!existingSeries) {
    throw { status: 404, message: "Série não encontrada ou acesso negado." };
  }
  const hasBeenExecuted = await seriesQueries.hasExecutions(seriesId);
  if (hasBeenExecuted) {
    return seriesQueries.createNewVersion(existingSeries, name, exercises);
  } else {
    return seriesQueries.updateSeriesInPlace(seriesId, name, exercises);
  }
};

const deleteSeriesForUser = async (seriesId, userId) => {
  const seriesToDelete = await seriesQueries.findSeriesById(seriesId, userId);
  if (!seriesToDelete) {
    throw { status: 404, message: "Série não encontrada ou acesso negado." };
  }
  const hasBeenExecuted = await seriesQueries.hasExecutions(seriesId);
  if (hasBeenExecuted) {
    return seriesQueries.softDeleteSeries(seriesId);
  } else {
    return seriesQueries.hardDeleteSingleSeries(seriesId);
  }
};

const getSeriesVersionsForUser = async (seriesId, userId) => {
  const activeSeries = await seriesQueries.findSeriesById(seriesId, userId);
  if (!activeSeries) {
    throw { status: 404, message: "Série não encontrada ou acesso negado." };
  }
  const parentId = activeSeries.parent_series_id || activeSeries.id;
  return seriesQueries.findInactiveVersions(parentId, userId);
};

const getArchivedSeriesForUser = async (userId) => {
  return seriesQueries.findArchivedSeriesHeads(userId);
};

module.exports = {
  createSeriesForUser,
  getSeriesForUser,
  getSeriesByIdForUser,
  updateSeriesForUser,
  deleteSeriesForUser,
  getSeriesVersionsForUser,
  getArchivedSeriesForUser, // Nova exportação
};
