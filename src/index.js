import "./styles.css";
import projectManager from "./projectManager.js";
import storage from "./storage.js";
import domManager from "./domManager.js";
import formHandler from "./formHandler.js";
import { todoFactory } from "./todoFactory.js";
import { generateId } from "./utils.js";
import priorityStyles from "./priorityStyles.js";

// Initialize the Todo app
const initApp = () => {
  // Load persisted data or initialize with default state
  storage.load();

  // Render the initial UI
  domManager.init();
};

// Start the app
initApp();
