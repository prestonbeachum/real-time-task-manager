import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import CalendarView from "../components/CalendarView";
import ListView from "../components/ListView";
import TaskDetailModal from "../components/TaskDetailModal";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import TeamView, { type TeamViewHandle } from "../components/TeamView";
import SharedCalendarView from "../components/SharedCalendarView";
import BoardView from "../components/BoardView";

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
  assignedTo?: string;
  sharedWith?: string[];
}

const ModernDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("list");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const teamRef = useRef<TeamViewHandle | null>(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const fetchTasks = useCallback(async () => {
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
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await axios.post("/tasks", taskData);
      setShowCreateModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    // Optimistically remove from UI for instant feedback
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }

    try {
      await axios.delete(`/tasks/${taskId}`);
      // Silent refresh to ensure server state sync
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      // On failure, re-fetch to restore accurate state
      fetchTasks();
    }
  };

  const handleUpdateTask = async (task: Task) => {
    // Optimistic update for snappy UX
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...task } : t)));
    setSelectedTask(null);
    setShowEditModal(false);
    setTaskToEdit(null);

    try {
      await axios.put(`/tasks/${task.id}`, task);
      // Ensure server truth
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      // Re-sync on failure
      fetchTasks();
      setErrorMessage("Failed to save changes. Reverted to server state.");
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  const handleToggleComplete = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      await axios.put(`/tasks/${taskId}`, { ...task, completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your tasks...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case "calendar":
        return (
          <CalendarView
            tasks={tasks}
            onTaskClick={setSelectedTask}
          />
        );
      case "list":
        return (
          <ListView
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onToggleComplete={handleToggleComplete}
          />
        );
      case "team":
        return <TeamView ref={teamRef} onError={(msg) => setErrorMessage(msg)} />;
      case "shared": {
        return <SharedCalendarView onTaskClick={setSelectedTask} />;
      }
      case "board":
        return (
          <BoardView
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onUpdateTask={handleUpdateTask}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        username={username}
      />

      {/* Main Content */}
      <div className="ml-64 p-6 h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {currentView === "calendar" && "My Calendar"}
              {currentView === "list" && "My Tasks"}
              {currentView === "board" && "Board View"}
              {currentView === "team" && "Team Members"}
              {currentView === "shared" && "Team Calendar"}
            </h1>
            <p className="text-gray-600 mt-1">
              {currentView === "calendar" && "Visualize your tasks on a calendar"}
              {currentView === "list" && "Manage your tasks efficiently"}
              {currentView === "board" && "Organize tasks with Kanban"}
              {currentView === "team" && "Invite and manage your team members"}
              {currentView === "shared" && "View and collaborate on team calendars"}
            </p>
          </div>
          
          {/* Right Header Button */}
          {currentView === "team" ? (
            <button
              onClick={() => teamRef.current?.openInvite()}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              Invite
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              New Task
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
          onEdit={handleEditTask}
        />
      )}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreateTask={handleCreateTask}
        />
      )}

      {showEditModal && taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          onClose={() => {
            setShowEditModal(false);
            setTaskToEdit(null);
          }}
          onSave={handleUpdateTask}
        />
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-slide-up">
          <p className="font-medium">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage("")}
            className="ml-2 hover:bg-red-600 rounded-full p-1 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ModernDashboard;
