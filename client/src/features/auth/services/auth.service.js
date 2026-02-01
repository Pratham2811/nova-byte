import axiosInstance from "@/shared/services/axios";

export const loginApi = async (userData) => {
  const { data } = await axiosInstance.post("/auth/login", userData);
  return data;
};

export const registerApi = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const logoutApi = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

export const getCurrentUserApi = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  console.log(data);
  
  return data;
};