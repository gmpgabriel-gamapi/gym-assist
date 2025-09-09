import apiClient from "./apiClient";

export const getActivePlan = async (studentId) => {
  try {
    const response = await apiClient.get(`/training-plans/active/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updatePlanSeries = async (planId, seriesIds) => {
  try {
    const response = await apiClient.put(`/training-plans/${planId}/series`, {
      seriesIds,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
