import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      alert("Unable to load tasks. Are you logged in?");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    // Clear session data if needed
    navigate("/login");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-600 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-lg">No tasks found. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white text-black p-4 rounded shadow hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-sm">{task.description}</p>
              <p className="text-sm">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p
                className={`mt-2 font-medium ${
                  task.completed ? "text-green-600" : "text-red-600"
                }`}
              >
                {task.completed ? "Completed" : "Incomplete"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
