import axiosInstance from "@/shared/services/axios";

/**
 * Update user profile (name, email)
 */
export const updateProfileApi = async ({ name, email }) => {
  const { data } = await axiosInstance.patch("/user/profile", { name, email });
  return data;
};

/**
 * Upload user avatar
 * @param {File} file - Image file
 */
export const uploadAvatarApi = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await axiosInstance.post("/user/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Update user password
 */
export const updatePasswordApi = async ({ currentPassword, newPassword }) => {
  const { data } = await axiosInstance.post("/user/password", {
    currentPassword,
    newPassword,
  });
  return data;
};

/**
 * Delete user account
 */
export const deleteAccountApi = async () => {
  const { data } = await axiosInstance.delete("/user/account");
  return data;
};

/**
 * Fetch current user profile
 */
export const fetchUserProfileApi = async () => {
  const { data } = await axiosInstance.get("/user");
  return data;
};
