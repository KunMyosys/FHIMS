import axiosInstance from "./axiosInstance";

export const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const res = await axiosInstance.post("/User/reset-password", payload);
  return res.data; 
};
