import axios from "axios";

const API_URL = "http://localhost:8080";

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data); // Show backend error message
    }
    console.error(error); // For debugging
    throw new Error("Unable to connect to server. Is the backend running?");
  }
};
