import axiosInstance from "./axiosInstance";

export interface Currency {
  currencySymbol: string | undefined;
  value: string;
  currencyId: number;
  currencyCode: string;
  currencyName: string;
}

export interface HeadCurrencyRate {
  headCurrencyId?: number;
  headId: number; // 1 = Niyaz, 2 = Zabihat, 3 = Mannat
  currencyId: number;
  rate: number;
}

export interface Receipt {
  receiptNumber: string;
  location: string;
  itsNo: string;
  mumeenInfo: any;
  head: string;
  currency: string;
  unitRate: number;
  units: number;
  amount: number;
  discount: number;
  total: number;
  approved: number;
  createdAt: string;
  userId: string;
  userName: string;
}

// Fetch all currencies
export const getAllCurrencies = async (): Promise<Currency[]> => {
  try {
    const response = await axiosInstance.get("/Currency");
    return response.data;
  } catch (error) {
    return [];
  }
};

// Fetch head-currency specific rate
export const getHeadCurrencyRate = async (
  headId: number,
  currencyId: number
): Promise<number> => {
  try {
    // Correct endpoint with subpath
    const response = await axiosInstance.get(
      `/HeadCurrency/by-head-and-currency`,
      { params: { headId, currencyId } }
    );

    if (response.data && typeof response.data.rate === "number") {
      return response.data.rate;
    }

    return 0;
  } catch (error) {
    return 0;
  }
};

const USE_BACKEND_API = false; //

export const createReceipt = async (data: Receipt): Promise<any> => {
  try {
    if (USE_BACKEND_API) {
      const response = await axiosInstance.post("/Receipt", data);
      return response.data;
    } else {
      const stored = localStorage.getItem("mannatNiyazReceipts");
      const existingReceipts = stored ? JSON.parse(stored) : [];
      existingReceipts.push(data);
      localStorage.setItem(
        "mannatNiyazReceipts",
        JSON.stringify(existingReceipts)
      );
      return { success: true, local: true };
    }
  } catch (error) {
    throw error;
  }
};
