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

interface ListView2Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (taskId: number) => void;
}

const ListView2 = ({ tasks, onTaskClick, onToggleComplete }: ListView2Props) => {
  const getPriorityBadge = (priority: string) => {
    const colors = {
      High: "bg-red-100 text-red-700 border-red-300",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Low: "bg-green-100 text-green-700 border-green-300",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Then by priority
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  return (
    <div className="h-full bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Tasks</h2>
        <div className="flex gap-2 text-sm">
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            {tasks.filter(t => !t.completed).length} Active
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
            {tasks.filter(t => t.completed).length} Completed
          </span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-xl font-semibold">No tasks yet</p>
          <p className="text-sm mt-2">Create your first task to get started!</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`group p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer ${
                task.completed ? "bg-gray-50 opacity-70" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(task.id);
                  }}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 hover:border-indigo-500"
                  }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                      {task.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.label && (
                      <span className="flex items-center gap-1">
                        <span className="text-xs font-semibold">Label:</span>
                        {task.label}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <span className="text-xs font-semibold">Due:</span>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.assignedTo && (
                      <span className="flex items-center gap-1">
                        <span className="text-xs font-semibold">Assigned:</span>
                        {task.assignedTo}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListView2;
