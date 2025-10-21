import { useState } from "react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  username: string;
  onSettings?: () => void;
}

const Sidebar = ({ currentView, onViewChange, onLogout, username, onSettings }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "list", icon: "List", label: "My Tasks" },
    { id: "calendar", icon: "Cal", label: "My Calendar" },
    { id: "shared", icon: "Share", label: "Team Calendar" },
    { id: "team", icon: "Team", label: "Team Members" },
    { id: "board", icon: "Board", label: "Board" },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
        } bg-white h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col shadow-2xl z-50 border-r border-gray-200`}
    >
      {/* Header */}
        <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
                <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-gray-600 text-sm mt-1">Collaborate & Achieve</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-lg text-white">
            {username.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-gray-900">{username}</p>
                <p className="text-gray-600 text-xs">Premium Member</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === item.id
                ? "bg-indigo-50 border border-indigo-300 text-indigo-700 shadow-sm"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span className="text-sm font-bold">{item.icon}</span>
            {!isCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
        <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
          onClick={() => {
            if (onSettings) {
              onSettings();
            } else {
              alert("Settings feature coming soon!");
            }
          }}
        >
            <span className="text-sm font-bold">Set</span>
            {!isCollapsed && <span>Settings</span>}
        </button>
        <button
          onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-red-700"
        >
            <span className="text-sm font-bold">Out</span>
            {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
