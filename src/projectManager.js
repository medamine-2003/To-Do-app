import { todoFactory } from "./todoFactory.js";

// Manager for projects and todos
const projectManager = (() => {
  // Private data structure to store projects
  let projects = {};

  // Initialize with a default "Inbox" project
  const init = () => {
    if (!projects["Inbox"]) {
      projects["Inbox"] = [];
    }
  };

  // Add a new project (returns true if successful, false if name exists)
  const addProject = (name) => {
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new Error("Project name must be a non-empty string");
    }
    if (projects[name.trim()]) {
      return false; // Project already exists
    }
    projects[name.trim()] = [];
    return true;
  };

  // Add a todo to a specific project
  const addTodo = (projectName, id, title, description, dueDate, priority, notes = "", checklist = []) => {
    if (!projects[projectName]) {
      throw new Error(`Project "${projectName}" does not exist`);
    }
    const todo = todoFactory(id, title, description, dueDate, priority, notes, checklist);
    projects[projectName].push(todo);
    return todo;
  };

  // Remove a todo by ID from a specific project
  const removeTodo = (projectName, todoId) => {
    if (!projects[projectName]) {
      throw new Error(`Project "${projectName}" does not exist`);
    }
    const index = projects[projectName].findIndex(todo => todo.id === todoId);
    if (index !== -1) {
      projects[projectName].splice(index, 1);
      return true;
    }
    return false;
  };

  // Get all project names
  const getProjects = () => Object.keys(projects);

  // Get todos for a specific project
  const getTodos = (projectName) => {
    if (!projects[projectName]) {
      throw new Error(`Project "${projectName}" does not exist`);
    }
    return [...projects[projectName]]; // Return a copy to prevent mutation
  };

  // Get a specific todo by ID from a project
  const getTodo = (projectName, todoId) => {
    if (!projects[projectName]) {
      throw new Error(`Project "${projectName}" does not exist`);
    }
    return projects[projectName].find(todo => todo.id === todoId) || null;
  };

  // Update a todo's details
  const updateTodo = (projectName, todoId, updates) => {
    const todo = getTodo(projectName, todoId);
    if (todo) {
      todo.updateDetails(updates);
      return true;
    }
    return false;
  };

  // Initialize the manager
  init();

  // Export public methods
  return {
    addProject,
    addTodo,
    removeTodo,
    getProjects,
    getTodos,
    getTodo,
    updateTodo,
  };
})();

export default projectManager;