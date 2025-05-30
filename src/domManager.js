import projectManager from "./projectManager.js";
import storage from "./storage.js";
import { formatDate, daysUntilDue } from "./utils.js";
import formHandler from "./formHandler.js";
import { getPriorityClass } from "./priorityStyles.js";

// DOM Manager for rendering the UI and handling events
const domManager = (() => {
  let currentProject = "Inbox"; // Track the currently selected project

  // DOM elements
  const sidebar = document.getElementById("sidebar");
  const todoList = document.getElementById("todo-list");
  const todoDetails = document.getElementById("todo-details");

  // Initialize the UI
  const init = () => {
    renderSidebar();
    renderTodoList();
    setupEventListeners();
  };

  // Render the sidebar with project names
  const renderSidebar = () => {
    sidebar.innerHTML = "<h2>Projects</h2>";
    const projectList = document.createElement("ul");
    projectManager.getProjects().forEach((project) => {
      const li = document.createElement("li");
      li.textContent = project;
      li.classList.toggle("active", project === currentProject);
      li.addEventListener("click", () => {
        currentProject = project;
        renderSidebar();
        renderTodoList();
      });
      projectList.appendChild(li);
    });
    sidebar.appendChild(projectList);

    // Add project button
    const addProjectBtn = document.createElement("button");
    addProjectBtn.textContent = "+ Add Project";
    addProjectBtn.addEventListener("click", () => {
      const form = formHandler.createProjectForm();
      sidebar.appendChild(form);
    });
    sidebar.appendChild(addProjectBtn);
  };

  // Render the todo list for the current project
  const renderTodoList = () => {
    todoList.innerHTML = `<h2>${currentProject}</h2>`;
    const todos = projectManager.getTodos(currentProject);

    // Add todo button
    const addTodoBtn = document.createElement("button");
    addTodoBtn.textContent = "+ Add Todo";
    addTodoBtn.addEventListener("click", () => {
      const form = formHandler.createTodoForm(
        currentProject,
        null,
        handleTodoSubmit
      );
      todoList.appendChild(form);
    });
    todoList.appendChild(addTodoBtn);

    // Render todos
    const list = document.createElement("ul");
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.classList.add("todo-item", getPriorityClass(todo.priority));
      li.innerHTML = `
        <span>${todo.title} - Due: ${formatDate(todo.dueDate)} (${daysUntilDue(
        todo.dueDate
      )} days)</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      // Edit button
      li.querySelector(".edit-btn").addEventListener("click", () => {
        todoDetails.innerHTML = "";
        const form = formHandler.createTodoForm(
          currentProject,
          todo,
          handleTodoSubmit
        );
        todoDetails.appendChild(form);
      });

      // Delete button
      li.querySelector(".delete-btn").addEventListener("click", () => {
        projectManager.removeTodo(currentProject, todo.id);
        storage.save();
        renderTodoList();
      });

      list.appendChild(li);
    });
    todoList.appendChild(list);
  };

  // Handle todo form submission
  const handleTodoSubmit = (projectName, todoId, formData) => {
    if (todoId) {
      // Update existing todo
      projectManager.updateTodo(projectName, todoId, formData);
    } else {
      // Add new todo
      projectManager.addTodo(
        projectName,
        formData.id,
        formData.title,
        formData.description,
        formData.dueDate,
        formData.priority,
        formData.notes,
        formData.checklist
      );
    }
    storage.save();
    todoDetails.innerHTML = ""; // Clear details view
    renderTodoList();
  };

  // Setup global event listeners
  const setupEventListeners = () => {
    // Add any global listeners if needed
  };

  // Export public methods
  return {
    init,
    renderTodoList, // Exposed for external calls (e.g., after adding a project)
  };
})();

export default domManager;
