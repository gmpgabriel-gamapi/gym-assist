import apiClient from "./apiClient";

export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
