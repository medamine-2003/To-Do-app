import { parseISO, isValid, isFuture } from "date-fns";

// Factory function to create a todo item
export function todoFactory(id, title, description, dueDate, priority, notes = "", checklist = []) {
  // Validate inputs
  if (!id || typeof id !== "string") {
    throw new Error("ID must be a non-empty string");
  }
  if (!title || typeof title !== "string") {
    throw new Error("Title must be a non-empty string");
  }
  if (!description || typeof description !== "string") {
    throw new Error("Description must be a non-empty string");
  }
  if (!priority || !["low", "medium", "high"].includes(priority)) {
    throw new Error("Priority must be 'low', 'medium', or 'high'");
  }

  // Validate dueDate using date-fns
  const parsedDate = parseISO(dueDate);
  if (!isValid(parsedDate)) {
    throw new Error("Due date must be a valid ISO date string (e.g., '2025-05-30')");
  }
  if (!isFuture(parsedDate)) {
    throw new Error("Due date must be in the future");
  }

  // Ensure checklist is an array of objects with text and completed properties
  const validatedChecklist = checklist.map(item => ({
    text: item.text || "",
    completed: Boolean(item.completed),
  }));

  // Todo object with properties and methods
  return {
    id,
    title,
    description,
    dueDate, // Stored as ISO string (e.g., "2025-05-30")
    priority,
    notes,
    checklist: validatedChecklist,
    completed: false,

    // Methods
    toggleComplete() {
      this.completed = !this.completed;
    },
    setPriority(newPriority) {
      if (!["low", "medium", "high"].includes(newPriority)) {
        throw new Error("Priority must be 'low', 'medium', or 'high'");
      }
      this.priority = newPriority;
    },
    updateDetails({ title, description, dueDate, notes, checklist }) {
      if (title) this.title = title;
      if (description) this.description = description;
      if (dueDate) {
        const parsed = parseISO(dueDate);
        if (!isValid(parsed) || !isFuture(parsed)) {
          throw new Error("Due date must be a valid future date");
        }
        this.dueDate = dueDate;
      }
      if (notes) this.notes = notes;
      if (checklist) {
        this.checklist = checklist.map(item => ({
          text: item.text || "",
          completed: Boolean(item.completed),
        }));
      }
    },
    toggleChecklistItem(index) {
      if (index >= 0 && index < this.checklist.length) {
        this.checklist[index].completed = !this.checklist[index].completed;
      }
    },
  };
}