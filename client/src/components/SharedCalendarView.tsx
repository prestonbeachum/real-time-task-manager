import { useState, useEffect } from "react";
import axios from "../api/axios";
import CalendarView from "./CalendarView";

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

interface TeamMember {
  username: string;
  email: string;
  role: string;
}

interface SharedCalendarViewProps {
  onTaskClick: (task: Task) => void;
}

const SharedCalendarView = ({ onTaskClick }: SharedCalendarViewProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [memberTasks, setMemberTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"individual" | "combined">("individual");

  const currentUser = localStorage.getItem("username") || "User";

  useEffect(() => {
    fetchTeamMembers();
    fetchMyTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get("/users");
      if (Array.isArray(response.data)) {
        setTeamMembers(response.data.filter((u: TeamMember) => u.username !== currentUser));
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchMyTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      if (Array.isArray(response.data)) {
        setMyTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching my tasks:", error);
    }
  };

  const fetchMemberTasks = async (username: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/tasks/user/${username}`);
      if (Array.isArray(response.data)) {
        setMemberTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching member tasks:", error);
      setMemberTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = (username: string) => {
    setSelectedMember(username);
    fetchMemberTasks(username);
  };

  const displayTasks = () => {
    if (viewMode === "combined") {
      return [...myTasks, ...memberTasks];
    }
    return selectedMember ? memberTasks : myTasks;
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Team Member Selector */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Shared Team Calendar</h2>
        
        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode("individual")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "individual"
                ? "bg-white text-indigo-700"
                : "bg-indigo-700 text-white hover:bg-indigo-800"
            }`}
          >
            Individual View
          </button>
          <button
            onClick={() => setViewMode("combined")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "combined"
                ? "bg-white text-indigo-700"
                : "bg-indigo-700 text-white hover:bg-indigo-800"
            }`}
          >
            Combined View
          </button>
        </div>

        {/* Team Member Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedMember(null);
              setMemberTasks([]);
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              !selectedMember
                ? "bg-white text-indigo-700 shadow-lg"
                : "bg-indigo-700 text-white hover:bg-indigo-800"
            }`}
          >
            My Calendar ({currentUser})
          </button>
          {teamMembers.map((member) => (
            <button
              key={member.username}
              onClick={() => handleSelectMember(member.username)}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                selectedMember === member.username
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "bg-indigo-700 text-white hover:bg-indigo-800"
              }`}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                {member.username.charAt(0).toUpperCase()}
              </div>
              {member.username}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 p-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <CalendarView tasks={displayTasks()} onTaskClick={onTaskClick} />
            {viewMode === "combined" && (
              <div className="mt-4 flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">My Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-600">Team Tasks</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedCalendarView;
