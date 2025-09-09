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
    const { seriesIds } = req.body; // Espera um array de IDs de séries
    const requesterId = req.user.id;

    if (!Array.isArray(seriesIds)) {
      return res
        .status(400)
        .json({
          message: "O corpo da requisição deve conter um array de seriesIds.",
        });
    }

    const result = await trainingPlanService.updateActivePlanSeries(
      planId,
      requesterId,
      seriesIds
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
