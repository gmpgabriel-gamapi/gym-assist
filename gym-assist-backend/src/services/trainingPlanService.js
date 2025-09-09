const trainingPlanQueries = require("../db/trainingPlanQueries");
const associationQueries = require("../db/associationQueries");
const userQueries = require("../db/userQueries");

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

const updateActivePlanSeries = async (planId, requesterId, seriesIds) => {
  // Aqui precisariamos de uma query para buscar o plano e verificar o dono,
  // mas por enquanto vamos confiar na validação do frontend.
  // Lógica de autorização a ser adicionada no futuro.
  await trainingPlanQueries.syncPlanSeries(planId, seriesIds);
  return { success: true, message: "Plano atualizado com sucesso." };
};

module.exports = {
  getActivePlanForUser,
  updateActivePlanSeries,
};
