// [BACKEND] arquivo: src/services/exerciseService.js (VERSÃO 100% COMPLETA)
const exerciseQueries = require("../db/exerciseQueries");
const seriesService = require("./seriesService");

const createCustomExercise = async (exerciseData) => {
  const newExercise = await exerciseQueries.createCustomExercise(exerciseData);
  return newExercise;
};

const getAllExercisesForUser = async (userId) => {
  const baseExercisesPromise = exerciseQueries.findAllBase();
  const customExercisesPromise = exerciseQueries.findCustomByOwnerId(userId);

  const [baseExercises, customExercises] = await Promise.all([
    baseExercisesPromise,
    customExercisesPromise,
  ]);

  const formattedBase = baseExercises.map((ex) => ({
    ...ex,
    type: "base",
  }));

  const formattedCustom = customExercises.map((ex) => ({
    ...ex,
    type: "custom",
    muscle_group_ids: ex.primary_muscle_group_id
      ? [ex.primary_muscle_group_id]
      : [],
  }));

  return [...formattedBase, ...formattedCustom];
};

const updateCustomExercise = async (exerciseId, userId, updateData) => {
  const exercise = await exerciseQueries.findCustomById(exerciseId);
  if (!exercise) {
    throw { status: 404, message: "Exercício não encontrado." };
  }
  if (exercise.owner_id !== userId) {
    throw {
      status: 403,
      message:
        "Acesso negado. Você não tem permissão para editar este exercício.",
    };
  }

  const hasBeenExecuted = await exerciseQueries.hasExecutions(exerciseId);
  let newExerciseVersion;

  if (hasBeenExecuted) {
    newExerciseVersion = await exerciseQueries.createNewVersion(
      exercise,
      updateData
    );

    // Inicia a cascata!
    await seriesService.propagateExerciseUpdate(
      exercise.id,
      newExerciseVersion
    );
  } else {
    newExerciseVersion = await exerciseQueries.updateInPlace(
      exerciseId,
      updateData
    );
  }

  return newExerciseVersion;
};

const deleteCustomExercise = async (exerciseId, userId) => {
  const exercise = await exerciseQueries.findCustomById(exerciseId);
  if (!exercise) {
    throw { status: 404, message: "Exercício não encontrado." };
  }
  if (exercise.owner_id !== userId) {
    throw {
      status: 403,
      message:
        "Acesso negado. Você não tem permissão para deletar este exercício.",
    };
  }
  return exerciseQueries.deleteCustomExercise(exerciseId);
};

module.exports = {
  createCustomExercise,
  getAllExercisesForUser,
  updateCustomExercise,
  deleteCustomExercise,
};
