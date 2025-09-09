import apiClient from "./apiClient";

export const addStudent = async (studentName, studentEmail) => {
  try {
    const response = await apiClient.post("/associations/student", {
      studentName,
      studentEmail,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMyStudents = async () => {
  try {
    const response = await apiClient.get("/associations/students");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
