import { useState, useMemo } from "react";

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

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const CalendarView = ({ tasks, onTaskClick }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysArray = [];

    // Add empty cells for days before the first day of the month
    const startingDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startingDayOfWeek; i++) {
      daysArray.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysArray.push(new Date(year, month, day));
    }
    // Pad trailing empty cells so grid is always 6 rows (42 cells)
    while (daysArray.length % 7 !== 0) {
      daysArray.push(null);
    }
    if (daysArray.length < 42) {
      const toAdd = 42 - daysArray.length;
      for (let i = 0; i < toAdd; i++) daysArray.push(null);
    }

    return daysArray;
  }, [currentDate]);

  const getTasksForDay = (date: Date | null) => {
    if (!date) return [];
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg p-6 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h2 className="text-3xl font-bold text-gray-800">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
          >
            Today
          </button>
          <button
            onClick={goToPreviousMonth}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToNextMonth}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 overflow-y-auto flex-1 pb-4">
        {daysInMonth.map((date, index) => {
          const dayTasks = getTasksForDay(date);
          const today = isToday(date);

          return (
            <div
              key={index}
              className={`border rounded-lg p-2 h-[120px] transition-all hover:shadow-md ${
                date
                  ? today
                    ? "bg-indigo-50 border-indigo-400 border-2"
                    : "bg-white hover:bg-gray-50"
                  : "bg-gray-50"
              }`}
            >
              {date && (
                <>
                  <div
                    className={`text-sm font-semibold mb-2 ${
                      today ? "text-indigo-700" : "text-gray-700"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-[80px]">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={`text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                          task.completed ? "opacity-50" : ""
                        }`}
                        style={{
                          backgroundColor:
                            task.priority === "High"
                              ? "#fee2e2"
                              : task.priority === "Medium"
                              ? "#fef3c7"
                              : "#d1fae5",
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(
                              task.priority
                            )}`}
                          ></div>
                          <span className="truncate font-medium text-gray-800">
                            {task.title}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
