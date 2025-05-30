import { todoFactory } from "./todoFactory.js";
import projectManager from "./projectManager.js";

// Storage module for localStorage persistence
const storage = (() => {
  const STORAGE_KEY = "todoAppData";

  // Save projects to localStorage
  const save = () => {
    const projectsData = projectManager
      .getProjects()
      .reduce((acc, projectName) => {
        acc[projectName] = projectManager.getTodos(projectName).map((todo) => ({
          id: todo.id,
          title: todo.title,
          description: todo.description,
          dueDate: todo.dueDate,
          priority: todo.priority,
          notes: todo.notes,
          checklist: todo.checklist,
          completed: todo.completed,
        }));
        return acc;
      }, {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsData));
  };

  // Load projects from localStorage and reattach methods
  const load = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      // No data, initialize with default "Inbox" project
      projectManager.addProject("Inbox");
      save();
      return;
    }

    try {
      const projectsData = JSON.parse(savedData);
      if (typeof projectsData !== "object" || projectsData === null) {
        throw new Error("Invalid data format in localStorage");
      }

      // Clear existing projects and reload
      projectManager.getProjects().forEach((projectName) => {
        if (projectName !== "Inbox") projectManager.addProject(projectName); // Preserve Inbox
      });
      Object.keys(projectsData).forEach((projectName) => {
        projectsData[projectName].forEach((todoData) => {
          projectManager.addTodo(
            projectName,
            todoData.id,
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.checklist
          );
        });
      });

      // Reattach methods to existing todos
      projectManager.getProjects().forEach((projectName) => {
        const todos = projectManager.getTodos(projectName);
        todos.forEach((todo) => {
          const newTodo = todoFactory(
            todo.id,
            todo.title,
            todo.description,
            todo.dueDate,
            todo.priority,
            todo.notes,
            todo.checklist
          );
          Object.assign(todo, newTodo); // Overwrite with new instance to reattach methods
        });
      });
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // Fallback to default state
      localStorage.removeItem(STORAGE_KEY);
      projectManager.addProject("Inbox");
      save();
    }
  };

  // Export public methods
  return {
    save,
    load,
  };
})();

export default storage;
