import { useState } from "react";

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

interface BoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
}

type BoardColumn = "todo" | "inProgress" | "done";

const BoardView = ({ tasks, onTaskClick, onUpdateTask }: BoardViewProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // Categorize tasks into columns
  const getTasksByStatus = (status: BoardColumn) => {
    return tasks.filter((task) => {
      if (status === "done") return task.completed;
      if (status === "inProgress") {
        // High priority incomplete tasks
        return !task.completed && task.priority === "High";
      }
      // Todo: Everything else incomplete
      return !task.completed && task.priority !== "High";
    });
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: BoardColumn) => {
    if (!draggedTask) return;

    const updatedTask = { ...draggedTask };
    
    if (status === "done") {
      updatedTask.completed = true;
    } else if (status === "inProgress") {
      updatedTask.completed = false;
      updatedTask.priority = "High";
    } else {
      updatedTask.completed = false;
      if (updatedTask.priority === "High") {
        updatedTask.priority = "Medium";
      }
    }

    onUpdateTask(updatedTask);
    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-l-4 border-red-500";
      case "Medium":
        return "border-l-4 border-yellow-500";
      case "Low":
        return "border-l-4 border-green-500";
      default:
        return "border-l-4 border-gray-500";
    }
  };

  const columns: { id: BoardColumn; title: string; color: string }[] = [
    { id: "todo", title: "To Do", color: "bg-gray-100" },
    { id: "inProgress", title: "In Progress", color: "bg-blue-100" },
    { id: "done", title: "Done", color: "bg-green-100" },
  ];

  return (
    <div className="h-full bg-white rounded-xl shadow-lg p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Kanban Board</h2>
          <p className="text-gray-600 text-sm mt-1">
            Drag and drop tasks to update their status
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
            {getTasksByStatus("todo").length} To Do
          </span>
          <span className="px-3 py-1 bg-blue-100 rounded-full text-blue-700">
            {getTasksByStatus("inProgress").length} In Progress
          </span>
          <span className="px-3 py-1 bg-green-100 rounded-full text-green-700">
            {getTasksByStatus("done").length} Done
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-100px)] overflow-hidden">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-xl p-4 flex flex-col`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              {column.title}
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({getTasksByStatus(column.id).length})
              </span>
            </h3>
            <div className="space-y-3 overflow-y-auto flex-1">
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onClick={() => onTaskClick(task)}
                  className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-move ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {task.assignedTo && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                      <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {task.assignedTo.charAt(0).toUpperCase()}
                      </div>
                      <span>{task.assignedTo}</span>
                    </div>
                  )}
                  {task.label && (
                    <div className="mt-2">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">
                        {task.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {getTasksByStatus(column.id).length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardView;
