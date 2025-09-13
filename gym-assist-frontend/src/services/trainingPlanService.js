// [FRONTEND] arquivo: src/services/trainingPlanService.js (VERSÃO 100% COMPLETA)
import apiClient from "./apiClient";

export const getActivePlan = async (studentId) => {
  try {
    const { data } = await apiClient.get(`/training-plans/active/${studentId}`);
    return data;
  } catch (error) {
    console.error("Erro ao buscar plano de treino ativo:", error);
    throw (
      error.response?.data ||
      new Error("Não foi possível buscar o plano de treino.")
    );
  }
};

export const updatePlanSeries = async (planId, planConfig) => {
  try {
    const { data } = await apiClient.put(
      `/training-plans/${planId}/series`,
      planConfig
    );
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o plano de treino:", error);
    throw (
      error.response?.data ||
      new Error("Não foi possível atualizar o plano de treino.")
    );
  }
};
