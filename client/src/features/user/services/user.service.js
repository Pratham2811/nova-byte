/**
 * User Service
 * Handles user profile operations
 */

import { get, patch } from "@/shared/services/api.service";

/**
 * Fetch current user profile
 * @returns {Promise<Object>} - User profile data
 */
export const fetchUserProfile = async () => {
  return await get("/user");
};

/**
 * Update user profile
 * @param {Object} updates - User profile updates (username, email, etc.)
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUserProfile = async (updates) => {
  return await patch("/user/update", updates);
};

export default {
  fetchUserProfile,
  updateUserProfile,
};
