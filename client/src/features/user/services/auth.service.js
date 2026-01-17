
import { post } from "@/shared/services/api.service";

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Login response data
 */
export const loginUser = async (email, password) => {
  return await post("/user/login-user", { email, password });
};

/**
 * Register new user
 * @param {string} username - Username
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Registration response data
 */
export const registerUser = async (username, email, password) => {
  return await post("/user/create-user", { username, email, password });
};

/**
 * Logout current user
 * @returns {Promise<Object>} - Logout response
 */
export const logoutUser = async () => {
  return await post("/user/logout", {});
};

export default {
  loginUser,
  registerUser,
  logoutUser,
};
