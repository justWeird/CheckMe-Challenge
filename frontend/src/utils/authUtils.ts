
/**
 * Parses the JWT token to get user information
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const parseJwt = (token: string): any => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param token - JWT token string
 * @returns Boolean indicating if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decodedToken = parseJwt(token);
  if (!decodedToken) {
    return true;
  }
  
  // Check if token has expiration claim
  if (!decodedToken.exp) {
    return false;
  }
  
  // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
  const expirationTime = decodedToken.exp * 1000;
  return Date.now() >= expirationTime;
};

/**
 * Gets user role from JWT token
 * @param token - JWT token string
 * @returns User role string or null if not found
 */
export const getUserRoleFromToken = (token: string): string | null => {
  const decodedToken = parseJwt(token);
  if (!decodedToken) {
    return null;
  }
  
  return decodedToken.role || null;
};

/**
 * Determines if the current user is a doctor based on their role
 * @param role - User role string
 * @returns Boolean indicating if user is a doctor
 */
export const isDoctor = (role: string | null): boolean => {
  return role === "doctor";
};

/**
 * Determines if the current user is a patient based on their role
 * @param role - User role string
 * @returns Boolean indicating if user is a patient
 */
export const isPatient = (role: string | null): boolean => {
  return role === "patient";
};
