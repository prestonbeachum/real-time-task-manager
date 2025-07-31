import api from "./axios";

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(typeof error.response.data === "string" ? error.response.data : "Registration failed.");
    } else {
      throw new Error("Unable to connect to server.");
    }
  }
};
