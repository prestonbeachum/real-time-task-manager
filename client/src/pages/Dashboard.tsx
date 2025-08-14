import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Low");
  const [newTaskReminder, setNewTaskReminder] = useState("");

  const navigate = useNavigate();

    const fetchTasks = async () => {
      try {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");

        if (!username || !password) {
          throw new Error("Not logged in.");
        }

        const response = await axios.get("/tasks", {
          auth: {
            username,
            password,
          },
        });

        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]);
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        setTasks([]);
        console.error("Error fetching tasks:", error);
        alert("Failed to load tasks. Are you logged in?");
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/login");
  };

const handleAddTask = async () => {
  try {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (!username || !password) {
      alert("You must be logged in to add tasks.");
      navigate("/login");
      return;
    }

    const formatDateTime = (d: Date) => {
      const pad = (n: number) => (n < 10 ? "0" + n : n);
      return (
        d.getFullYear() +
        "-" +
        pad(d.getMonth() + 1) +
        "-" +
        pad(d.getDate()) +
        "T" +
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes()) +
        ":" +
        pad(d.getSeconds())
      );
    };

    const payload = {
      title: newTaskTitle,
      description: newTaskDescription,
      label: newTaskLabel,
      priority: newTaskPriority,
      dueDate: formatDateTime(new Date(newTaskDueDate)),
      reminderTime: formatDateTime(new Date(newTaskReminder)),
      completed: false,
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post("/tasks", payload, {
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username,
        password,
      },
    });

    console.log("Task added:", response.data);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskLabel("");
    setNewTaskPriority("Low");
    setNewTaskDueDate("");
    setNewTaskReminder("");
    fetchTasks();
  } catch (error: any) {
    console.error("Error adding task:", error);
    console.error("Error details:", error?.response?.data || error.message);
    alert("Failed to add task.");
  }
};



  const handleEditTask = async (id: number, newTitle: string) => {
    try {
      await axios.put(`/tasks/${id}`, { title: newTitle });
      fetchTasks();
    } catch (error) {
      console.error("Error editing task:", error);
      alert("Failed to edit task.");
    }
  };

const handleDeleteTask = async (taskId: number) => {
  try {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (!username || !password) {
      alert("You must be logged in to delete tasks.");
      navigate("/login");
      return;
    }

    await axios.delete(`/tasks/${taskId}`, {
      auth: {
        username,
        password,
      },
    });

    console.log("Deleted task:", taskId);
    fetchTasks(); // refresh
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task.");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>

      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 text-black">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            />
            <input
              type="text"
              placeholder="Label"
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            />
            <input
              type="datetime-local"
              value={newTaskReminder}
              onChange={(e) => setNewTaskReminder(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            />
            <button
              onClick={handleAddTask}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-4"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2"
              >
                <input
                  type="text"
                  defaultValue={task.title}
                  onBlur={(e) => handleEditTask(task.id, e.target.value.trim())}
                  className="border rounded px-2 py-1 w-2/3 text-black"
                />
                <div className="space-x-2">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
