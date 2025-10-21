import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  label: string;
  priority: string;
  reminderTime: string;
  createdAt: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Low");
  const [newTaskReminder, setNewTaskReminder] = useState("");

  const navigate = useNavigate();

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("/tasks");

        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]);
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        setTasks([]);
        console.error("Error fetching tasks:", error);
        alert("Failed to load tasks. Please log in again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

const handleAddTask = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
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
    });

    console.log("Task added:", response.data);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskLabel("");
    setNewTaskPriority("Low");
    setNewTaskDueDate("");
    setNewTaskReminder("");
    fetchTasks();
  } catch (error: unknown) {
    console.error("Error adding task:", error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown }; message?: string };
      console.error("Error details:", axiosError?.response?.data || axiosError.message);
    }
    alert("Failed to add task.");
  }
};

  const handleDeleteTask = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to delete tasks.");
        navigate("/login");
        return;
      }

      await axios.delete(`/tasks/${taskId}`);

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
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-gray-100 rounded-lg overflow-hidden transition-all"
              >
                <div
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-200"
                  onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                    <div className="flex gap-3 mt-1 text-sm text-gray-600">
                      {task.label && (
                        <span className="bg-blue-100 px-2 py-0.5 rounded">{task.label}</span>
                      )}
                      {task.priority && (
                        <span className={`px-2 py-0.5 rounded ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        expandedTaskId === task.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {expandedTaskId === task.id && (
                  <div className="px-3 pb-3 bg-white border-t border-gray-200">
                    <div className="mt-3 space-y-2 text-sm">
                      {task.description && (
                        <div>
                          <span className="font-semibold text-gray-700">Description:</span>
                          <p className="text-gray-600 mt-1">{task.description}</p>
                        </div>
                      )}
                      {task.dueDate && (
                        <div>
                          <span className="font-semibold text-gray-700">Due Date:</span>
                          <p className="text-gray-600">{new Date(task.dueDate).toLocaleString()}</p>
                        </div>
                      )}
                      {task.reminderTime && (
                        <div>
                          <span className="font-semibold text-gray-700">Reminder:</span>
                          <p className="text-gray-600">{new Date(task.reminderTime).toLocaleString()}</p>
                        </div>
                      )}
                      {task.createdAt && (
                        <div>
                          <span className="font-semibold text-gray-700">Created:</span>
                          <p className="text-gray-600">{new Date(task.createdAt).toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-gray-700">Status:</span>
                        <p className="text-gray-600">{task.completed ? '✅ Completed' : '⏳ Pending'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
