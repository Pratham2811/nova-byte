import api from "@/shared/services/axios";

export const loginApi = async (userData) => {
  const { data } = await api.post("/auth/login", userData);
  return data;
};

export const registerApi = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const logoutApi = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getCurrentUserApi = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const verifyOtpApi = async ({ email, otp }) => {
  const { data } = await api.post("/auth/verify-otp", { email, otp });
  return data;
};

export const sendOtpApi = async (email) => {
  const { data } = await api.post("/auth/send-otp", { email });
  return data;
};