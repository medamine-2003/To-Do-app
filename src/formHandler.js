import projectManager from "./projectManager.js";
import storage from "./storage.js";
import { generateId, isValidString } from "./utils.js";
import domManager from "./domManager.js";

// Form Handler for creating and submitting forms
const formHandler = (() => {
  // Create a form for adding a new project
  const createProjectForm = () => {
    const form = document.createElement("form");
    form.classList.add("project-form");
    form.innerHTML = `
      <input type="text" name="name" placeholder="Project Name" required>
      <button type="submit">Add</button>
      <button type="button" class="cancel-btn">Cancel</button>
    `;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("input[name='name']").value;
      if (!isValidString(name)) {
        alert("Project name must be a non-empty string");
        return;
      }
      if (projectManager.addProject(name)) {
        storage.save();
        domManager.renderTodoList();
        form.remove();
      } else {
        alert("Project name already exists");
      }
    });

    form.querySelector(".cancel-btn").addEventListener("click", () => {
      form.remove();
    });

    return form;
  };

  // Create a form for adding/editing a todo
  const createTodoForm = (projectName, todo, onSubmit) => {
    const form = document.createElement("form");
    form.classList.add("todo-form");
    const isEditing = !!todo;
    form.innerHTML = `
      <input type="text" name="title" placeholder="Title" value="${
        todo ? todo.title : ""
      }" required>
      <textarea name="description" placeholder="Description">${
        todo ? todo.description : ""
      }</textarea>
      <input type="date" name="dueDate" value="${
        todo ? todo.dueDate : ""
      }" required>
      <select name="priority" required>
        <option value="low" ${
          todo && todo.priority === "low" ? "selected" : ""
        }>Low</option>
        <option value="medium" ${
          todo && todo.priority === "medium" ? "selected" : ""
        }>Medium</option>
        <option value="high" ${
          todo && todo.priority === "high" ? "selected" : ""
        }>High</option>
      </select>
      <textarea name="notes" placeholder="Notes">${
        todo ? todo.notes : ""
      }</textarea>
      <button type="submit">${isEditing ? "Update" : "Add"} Todo</button>
      <button type="button" class="cancel-btn">Cancel</button>
    `;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = {
        id: isEditing ? todo.id : generateId(),
        title: form.querySelector("input[name='title']").value,
        description: form.querySelector("textarea[name='description']").value,
        dueDate: form.querySelector("input[name='dueDate']").value,
        priority: form.querySelector("select[name='priority']").value,
        notes: form.querySelector("textarea[name='notes']").value,
        checklist: todo ? todo.checklist : [],
      };

      if (
        !isValidString(formData.title) ||
        !isValidString(formData.description)
      ) {
        alert("Title and description must be non-empty strings");
        return;
      }

      onSubmit(projectName, isEditing ? todo.id : null, formData);
    });

    form.querySelector(".cancel-btn").addEventListener("click", () => {
      form.remove();
    });

    return form;
  };

  return {
    createProjectForm,
    createTodoForm,
  };
})();

export default formHandler;
