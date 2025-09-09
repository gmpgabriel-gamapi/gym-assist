import apiClient from "./apiClient";

export const getAllExercises = async () => {
  try {
    const response = await apiClient.get("/exercises");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createCustomExercise = async (exerciseData) => {
  try {
    const response = await apiClient.post("/exercises/custom", exerciseData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// --- NOVAS FUNÇÕES ---
export const updateCustomExercise = async (id, exerciseData) => {
  try {
    const response = await apiClient.put(
      `/exercises/custom/${id}`,
      exerciseData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteCustomExercise = async (id) => {
  try {
    const response = await apiClient.delete(`/exercises/custom/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
