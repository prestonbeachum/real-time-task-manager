import api from "./axios";

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/login", { username, password });
    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Invalid username or password"
    );
  }
};
