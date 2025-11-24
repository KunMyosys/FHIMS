import axiosInstance from "./axiosInstance";

export interface Mumeen {
  muminDataId?: number;
  itsNo: string;
  fullName: string;
  email: string;
  whatsAppNo?: string | null;
  vatan: string;
}

export interface ReceiptDetail {
  currencyCode: string;
  unitRate: number;
  units: number;
  roundoff: number;
  isSelected: boolean;
}

export interface ReceiptPayload {
  receiptNo: string;
  itsNo: string;
  muminDataId: number;
  headId: number;
  locationCode: string;
  currencyCode: string;
  unitRate: number;
  units: number;
  amount: number;
  discount: number;
  totalAmount: number;
  isApproved: boolean;
  createdByUserID: number;
  details: ReceiptDetail[];
}

// Helper to get token safely
export const getAuthHeader = () => {
  const token = localStorage.getItem("fhims_auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET all Mumin Data
export const getAllMumeen = async (): Promise<Mumeen[]> => {
  try {
    const response = await axiosInstance.get("/MuminData", {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getMumeenById = async (
  muminDataId: number
): Promise<Mumeen | null> => {
  if (!muminDataId) return null;
  try {
    const response = await axiosInstance.get(`/MuminData/${muminDataId}`, {
      headers: { ...getAuthHeader() },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getMumeenByITS = async (itsNo: string): Promise<Mumeen | null> => {
  try {
    const response = await axiosInstance.get(`/MuminData/by-its/${itsNo}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// POST (Add new manual Mumin entry)
export const createMumeen = async (data: Mumeen): Promise<Mumeen | null> => {
  try {
    const response = await axiosInstance.post("/MuminData", data, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// POST Receipt API
export const createReceipt = async (
  data: ReceiptPayload
): Promise<any | null> => {
  try {
    const response = await axiosInstance.post("/Receipts", data, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getAllReceipts = async (pageNumber = 1, pageSize = 10) => {
  const response = await axiosInstance.get("/Receipts/list", {
    headers: {
      ...getAuthHeader(),
    },
    params: { pageNumber, pageSize },
  });
  return response.data; // now this returns { data, totalCount }
};

// GET Receipt by ID
export const getReceiptById = async (id: number): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`/Receipts/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// SEARCH Receipts with filters
export const searchReceipts = async (filters: any): Promise<any[]> => {
  try {
    const response = await axiosInstance.post(
      "/Receipts/dashboard/search",
      filters,
      { headers: { ...getAuthHeader() } }
    );
    const data =
      Array.isArray(response.data) && response.data.length
        ? response.data
        : (response.data?.data ?? []);

    return data;
  } catch (error) {
    return [];
  }
};

// Approve Receipt API
export const approveReceipt = async (
  receiptId: number,
  approvedByUserId: number
): Promise<boolean> => {
  try {
    const payload = {
      receiptId,
      approve: true,
      approvedByUserId,
    };

    const response = await axiosInstance.post(
      `/Receipts/${receiptId}/approve`,
      payload,
      { headers: { ...getAuthHeader() } }
    );

    return response.status >= 200 && response.status < 300;
  } catch (error: any) {
    return false;
  }
};
