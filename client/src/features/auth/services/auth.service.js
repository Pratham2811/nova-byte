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

export const verifyOtpApi= async ({email,otp})=>{
    const {data}=await axiosInstance.post("/auth/verify-otp",{email,otp});
    return data;
}
export const sendOtpApi=async(email)=>{
  console.log("sending otp to this email",email);
  

   const {data}=await axiosInstance.post("/auth/send-otp",{email:email});
    return data;

}