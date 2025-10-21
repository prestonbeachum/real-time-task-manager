import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "../api/axios";

interface TeamMember {
  username: string;
  email: string;
  role: string;
}

interface TeamViewProps {
  onError: (message: string) => void;
}

export interface TeamViewHandle {
  openInvite: () => void;
}

const TeamView = forwardRef<TeamViewHandle, TeamViewProps>(({ onError }, ref) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const currentUser = localStorage.getItem("username") || "User";

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

  useEffect(() => {
    fetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/users/search?q=${searchQuery}`);
      if (Array.isArray(response.data)) {
        setSearchResults(response.data.filter((u: TeamMember) => u.username !== currentUser));
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults(teamMembers.filter(m => 
        m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteUsername.trim()) {
      onError("Please enter both username and email");
      return;
    }

    try {
      await axios.post("/team/invite", {
        username: inviteUsername,
        email: inviteEmail,
      });
      setInviteEmail("");
      setInviteUsername("");
      setShowInviteModal(false);
      fetchTeamMembers();
    } catch (err) {
      console.error("Invite error:", err);
      onError("Failed to send invitation. User might not exist.");
    }
  };

  const displayMembers = searchQuery ? searchResults : teamMembers;

  useImperativeHandle(ref, () => ({
    openInvite: () => setShowInviteModal(true),
  }));

  return (
    <div className="h-full bg-white rounded-xl shadow-lg p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Team Collaboration</h2>
          <p className="text-gray-600 mt-1">Connect and collaborate with your team</p>
        </div>
        {/* Invite button is provided in the page header; keeping this area clean */}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) handleSearch();
              else setSearchResults([]);
            }}
            placeholder="Search team members..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Team Members List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          </div>
        ) : displayMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-xl font-semibold">
              {searchQuery ? "No members found" : "No team members yet"}
            </p>
            <p className="text-sm mt-2">
              {searchQuery ? "Try a different search term" : "Invite team members to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayMembers.map((member) => (
              <div
                key={member.username}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-xl">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-indigo-700">
                    {member.role || "Member"}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {member.username}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{member.email}</p>
                <button className="w-full px-4 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm">
                  View Calendar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <h3 className="text-2xl font-bold">Invite Team Member</h3>
              <p className="text-indigo-100 text-sm mt-1">
                Add someone to collaborate with
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  placeholder="Enter their username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="their@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  Note: The user must be registered to receive the invitation
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleInvite}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-lg"
                >
                  Send Invite
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TeamView;
