import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.get("/tasks", {
        auth: {
          username,
          password,
        },
      });

      if (response.status === 200) {
        setMessage("Login successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/dashboard"), 2000); // Redirect to dashboard
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          setMessage("Invalid username or password.");
        } else {
          setMessage("Login failed: " + error.response.statusText);
        }
      } else {
        setMessage("Unable to connect to server. Is it running?");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Login</h1>
        {message && (
          <p className="mb-4 text-center text-red-600 font-medium">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
