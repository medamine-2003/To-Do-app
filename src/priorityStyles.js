// Priority Styles for mapping priority levels to CSS classes
const priorityMap = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
};

const getPriorityClass = (priority) => {
  return priorityMap[priority] || "priority-low"; // Default to low if invalid
};

const priorityStyles = {
  getPriorityClass,
};

// Export the module
export default priorityStyles;
export { getPriorityClass };
