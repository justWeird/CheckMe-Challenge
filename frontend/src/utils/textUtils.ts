
/**
 * Capitalizes the first letter of each word in a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Truncates text to a specific length and adds ellipsis if needed
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + "...";
};

/**
 * Formats a name to show the first letter of the first name and full last name
 * @param name - Full name to format
 * @returns Formatted name
 */
export const formatName = (name: string): string => {
  if (!name) return "";
  
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  
  return `${firstName.charAt(0)}. ${lastName}`;
};

/**
 * Extracts initials from a name (up to 2 characters)
 * @param name - Name to extract initials from
 * @returns Initials
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
