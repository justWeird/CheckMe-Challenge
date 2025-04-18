
import { format, isToday, isYesterday, isTomorrow, addDays, subDays } from "date-fns";

/**
 * Formats a date string for display
 * @param dateString - The date string to format
 * @param formatString - Optional format string (default: "PPP")
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatString = "PPP"): string => {
  try {
    const date = new Date(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Returns a human-readable relative date (Today, Tomorrow, Yesterday, or formatted date)
 * @param dateString - The date string to format
 * @returns Human-readable date string
 */
export const getRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "PPP");
    }
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return dateString;
  }
};

/**
 * Formats a time string for display
 * @param timeString - The time string to format (e.g., "14:30")
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (timeString: string): string => {
  try {
    // Create a date object with the time
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    
    return format(date, "h:mm a");
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString;
  }
};

/**
 * Gets the next available dates for appointment booking
 * @param daysToInclude - Number of days to include in the result
 * @returns Array of Date objects, starting from tomorrow
 */
export const getNextAvailableDates = (daysToInclude = 30): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start with tomorrow
  const startDate = addDays(today, 1);
  
  for (let i = 0; i < daysToInclude; i++) {
    dates.push(addDays(startDate, i));
  }
  
  return dates;
};
