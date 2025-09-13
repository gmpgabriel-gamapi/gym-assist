// [BACKEND] arquivo: src/services/seriesService.js (VERSÃO 100% COMPLETA)
const seriesQueries = require("../db/seriesQueries");
const trainingPlanService = require("./trainingPlanService");

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
  let newSeriesVersion;

  if (hasBeenExecuted) {
    newSeriesVersion = await seriesQueries.createNewVersion(
      existingSeries,
      name,
      exercises
    );
    // Aciona a cascata para o plano de treino
    await trainingPlanService.propagateSeriesUpdate(
      existingSeries.id,
      newSeriesVersion
    );
  } else {
    newSeriesVersion = await seriesQueries.updateSeriesInPlace(
      seriesId,
      name,
      exercises
    );
  }
  return newSeriesVersion;
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

const propagateExerciseUpdate = async (oldExerciseId, newExercise) => {
  const affectedSeriesList = await seriesQueries.findSeriesContainingExercise(
    oldExerciseId
  );
  for (const series of affectedSeriesList) {
    const updatedExercises = series.exercises.map((ex) =>
      ex.id === oldExerciseId
        ? {
            ...newExercise,
            type: "custom",
            sets: ex.sets,
            reps: ex.reps,
            order: ex.order,
          }
        : ex
    );
    const hasBeenExecuted = await seriesQueries.hasExecutions(series.id);
    if (hasBeenExecuted) {
      await seriesQueries.createNewVersion(
        series,
        series.name,
        updatedExercises
      );
    } else {
      await seriesQueries.updateSeriesInPlace(
        series.id,
        series.name,
        updatedExercises
      );
    }
  }
};

module.exports = {
  createSeriesForUser,
  getSeriesForUser,
  getSeriesByIdForUser,
  updateSeriesForUser,
  deleteSeriesForUser,
  getSeriesVersionsForUser,
  getArchivedSeriesForUser,
  propagateExerciseUpdate,
};
