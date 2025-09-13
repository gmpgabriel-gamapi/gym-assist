// [BACKEND] arquivo: src/controllers/trainingPlanController.js (CORRIGIDO)
const trainingPlanService = require("../services/trainingPlanService");

const getActivePlan = async (req, res) => {
  try {
    const studentId = req.params.userId;
    const requesterId = req.user.id;
    const plan = await trainingPlanService.getActivePlanForUser(
      studentId,
      requesterId
    );
    res.status(200).json(plan);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Erro interno do servidor" });
  }
};

const updatePlanSeries = async (req, res) => {
  try {
    const { planId } = req.params;
    const planConfig = req.body; // Agora recebe o objeto { mode, data }
    const requesterId = req.user.id;

    // A validação agora é mais inteligente e fica no service
    const result = await trainingPlanService.updateActivePlanSeries(
      planId,
      requesterId,
      planConfig
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Erro interno do servidor" });
  }
};

module.exports = {
  getActivePlan,
  updatePlanSeries,
};
