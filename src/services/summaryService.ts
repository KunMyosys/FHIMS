import axiosInstance from "./axiosInstance";
import { getAuthHeader } from "./mumeenService"; 
export const getReceiptSummary = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/Receipts/summary", payload, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
