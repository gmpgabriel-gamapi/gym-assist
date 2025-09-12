// [FRONTEND] arquivo: src/services/seriesService.js (MODIFICADO)
import apiClient from "./apiClient";

export const getAllSeries = async () => {
  try {
    const { data } = await apiClient.get("/series");
    return data;
  } catch (error) {
    throw (
      error.response?.data || new Error("Não foi possível buscar as séries.")
    );
  }
};

export const getSeriesById = async (seriesId) => {
  try {
    const { data } = await apiClient.get(`/series/${seriesId}`);
    return data;
  } catch (error) {
    throw error.response?.data || new Error("Não foi possível buscar a série.");
  }
};

export const createSeries = async (seriesData) => {
  try {
    const { data } = await apiClient.post("/series", seriesData);
    return data;
  } catch (error) {
    throw error.response?.data || new Error("Não foi possível criar a série.");
  }
};

export const updateSeries = async (seriesId, seriesData) => {
  try {
    const { data } = await apiClient.put(`/series/${seriesId}`, seriesData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || new Error("Não foi possível atualizar a série.")
    );
  }
};

export const deleteSeries = async (seriesId) => {
  try {
    await apiClient.delete(`/series/${seriesId}`);
  } catch (error) {
    throw (
      error.response?.data || new Error("Não foi possível deletar a série.")
    );
  }
};

export const getSeriesVersions = async (seriesId) => {
  try {
    const { data } = await apiClient.get(`/series/${seriesId}/versions`);
    return data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Não foi possível buscar o histórico de versões.")
    );
  }
};

// --- ADIÇÃO DA NOVA FUNÇÃO ---
export const getArchivedSeries = async () => {
  try {
    const { data } = await apiClient.get("/series/archived");
    return data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Não foi possível buscar as séries arquivadas.")
    );
  }
};
