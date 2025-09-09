import apiClient from "./apiClient";

export const getSeriesForUser = async () => {
  try {
    const response = await apiClient.get("/series");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSeriesById = async (seriesId) => {
  try {
    const response = await apiClient.get(`/series/${seriesId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
