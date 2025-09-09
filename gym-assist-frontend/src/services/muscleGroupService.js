import apiClient from "./apiClient";

export const getMuscleGroups = async () => {
  try {
    const response = await apiClient.get("/muscle-groups");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
