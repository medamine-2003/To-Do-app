import { format, parseISO, isFuture, differenceInDays } from "date-fns";

// Utility functions for the Todo app

// Generate a unique ID based on timestamp and random number
export const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${timestamp}-${random}`;
};

// Format a date string (ISO format) for display
export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy"); // e.g., "May 30, 2025"
  } catch (error) {
    return "Invalid Date";
  }
};

// Check if a date is in the future (relative to May 30, 2025)
export const isDateInFuture = (dateString) => {
  try {
    const date = parseISO(dateString);
    return isFuture(date);
  } catch (error) {
    return false;
  }
};

// Calculate days until due date (returns a negative number if overdue)
export const daysUntilDue = (dateString) => {
  try {
    const date = parseISO(dateString);
    const currentDate = new Date("2025-05-30T01:09:00+02:00"); // Current date: May 30, 2025, 01:09 AM CET
    return differenceInDays(date, currentDate);
  } catch (error) {
    return null;
  }
};

// Validate a string (non-empty and trimmed)
export const isValidString = (str) => {
  return typeof str === "string" && str.trim().length > 0;
};
