// [BACKEND] arquivo: src/services/trainingPlanService.js (CORRIGIDO)
const trainingPlanQueries = require("../db/trainingPlanQueries");
const associationQueries = require("../db/associationQueries");

const getActivePlanForUser = async (studentId, requesterId) => {
  const isOwner = studentId === requesterId;
  const link = await associationQueries.findProfessorStudentLink(
    requesterId,
    studentId
  );
  const isHisProfessor = !!link;

  if (!isOwner && !isHisProfessor) {
    throw { status: 403, message: "Acesso negado." };
  }

  let plan = await trainingPlanQueries.findActivePlanByUserId(studentId);

  if (!plan) {
    console.log(
      `Nenhum plano ativo encontrado para o usuário ${studentId}, criando um novo.`
    );
    plan = await trainingPlanQueries.createInitialPlanForUser(studentId);
    plan.series = [];
  }

  return plan;
};

const updateActivePlanSeries = async (planId, requesterId, planConfig) => {
  const planToUpdate = await trainingPlanQueries.findActivePlanByUserId(
    requesterId
  );
  if (!planToUpdate || planToUpdate.id !== planId) {
    throw { status: 403, message: "Acesso negado ou plano não encontrado." };
  }

  const hasBeenExecuted = await trainingPlanQueries.hasExecutions(planId);

  if (hasBeenExecuted) {
    return trainingPlanQueries.createNewVersion(planToUpdate, planConfig);
  } else {
    await trainingPlanQueries.syncPlanSeries(planId, planConfig);
    const updatedPlan = await trainingPlanQueries.findActivePlanByUserId(
      requesterId
    );
    return updatedPlan;
  }
};

const propagateSeriesUpdate = async (oldSeriesId, newSeries) => {
  const affectedPlans =
    await trainingPlanQueries.findActivePlanContainingSeries(oldSeriesId);

  for (const plan of affectedPlans) {
    const currentSeriesIds = plan.series.map((s) => s.id);
    const newSeriesList = currentSeriesIds.map((id) =>
      id === oldSeriesId ? newSeries.id : id
    );

    const planConfig = {
      mode: "loop", // Assumindo que a propagação mantém o modo loop
      data: newSeriesList,
    };

    const hasBeenExecuted = await trainingPlanQueries.hasExecutions(plan.id);

    if (hasBeenExecuted) {
      await trainingPlanQueries.createNewVersion(plan, planConfig);
    } else {
      await trainingPlanQueries.syncPlanSeries(plan.id, planConfig);
    }
  }
};

module.exports = {
  getActivePlanForUser,
  updateActivePlanSeries,
  propagateSeriesUpdate,
};
