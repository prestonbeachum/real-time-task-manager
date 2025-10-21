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

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onDelete: (taskId: number) => void;
  onUpdate: (task: Task) => void;
  onEdit: (task: Task) => void;
}

const TaskDetailModal = ({ task, onClose, onDelete, onUpdate, onEdit }: TaskDetailModalProps) => {
  if (!task) return null;

  const handleToggleComplete = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
              <div className="flex gap-2 flex-wrap">
                {task.label && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {task.label}
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.priority === "High"
                      ? "bg-red-500"
                      : task.priority === "Medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {task.description || "No description provided"}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {task.dueDate && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                  Due Date
                </h3>
                <p className="text-gray-800 font-medium">
                  {new Date(task.dueDate).toLocaleString()}
                </p>
              </div>
            )}
            {task.reminderTime && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                  Reminder
                </h3>
                <p className="text-gray-800 font-medium">
                  {new Date(task.reminderTime).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Status
            </h3>
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                task.completed
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {task.completed ? "Completed" : "Mark as Complete"}
            </button>
          </div>

          {/* Collaboration Section */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
              Collaboration
            </h3>
            <div className="space-y-2">
              {task.assignedTo && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Assigned to:</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm">
                    {task.assignedTo}
                  </span>
                </div>
              )}
              {task.sharedWith && task.sharedWith.length > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Shared with:</span>
                  <div className="flex gap-1 flex-wrap">
                    {task.sharedWith.map((user, idx) => (
                      <span
                        key={idx}
                        className="bg-white px-3 py-1 rounded-full text-sm"
                      >
                        {user}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="text-sm text-gray-500">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl flex gap-3 border-t">
          <button
            onClick={() => {
              onEdit(task);
              onClose();
            }}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
          >
            Edit Task
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Delete button clicked for task:", task.id);
              if (confirm("Are you sure you want to delete this task?")) {
                console.log("User confirmed deletion");
                onDelete(task.id);
                onClose();
              } else {
                console.log("User cancelled deletion");
              }
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Delete Task
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
