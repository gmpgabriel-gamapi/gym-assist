import apiClient from "./apiClient";

export const getProfile = async () => {
  try {
    const response = await apiClient.get("/profile");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
