import { create } from "zustand";
import config from "@/config";

interface Payment {
  id: string;
  merchant: string;
  amount: string;
  status: string;
  created_at: string;
}

type SortField = "id" | "merchant" | "created_at" | "amount" | "status";
type SortOrder = "asc" | "desc";

interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  statusFilter: string;
  searchId: string;
  searchMerchant: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
  total: number;
  totalCompleted: number;
  totalProcessing: number;
  totalFailed: number;

  setStatusFilter: (val: string) => void;
  setSearchId: (val: string) => void;
  setSearchMerchant: (val: string) => void;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  setMinAmount: (val: string) => void;
  setMaxAmount: (val: string) => void;
  setSortField: (val: SortField) => void;
  setSortOrder: (val: SortOrder) => void;
  setPage: (val: number) => void;
  setLimit: (val: number) => void;
  fetchPayments: (token: string | null, logoutCallback: () => void) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,
  statusFilter: "all",
  searchId: "",
  searchMerchant: "",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  sortField: "created_at",
  sortOrder: "desc",
  page: 1,
  limit: 10,
  total: 0,
  totalCompleted: 0,
  totalProcessing: 0,
  totalFailed: 0,

  setStatusFilter: (val) => set({ statusFilter: val, page: 1 }),
  setSearchId: (val) => set({ searchId: val, page: 1 }),
  setSearchMerchant: (val) => set({ searchMerchant: val, page: 1 }),
  setStartDate: (val) => set({ startDate: val, page: 1 }),
  setEndDate: (val) => set({ endDate: val, page: 1 }),
  setMinAmount: (val) => set({ minAmount: val, page: 1 }),
  setMaxAmount: (val) => set({ maxAmount: val, page: 1 }),
  setSortField: (val) => set({ sortField: val }),
  setSortOrder: (val) => set({ sortOrder: val }),
  setPage: (val) => set({ page: val }),
  setLimit: (val) => set({ limit: val, page: 1 }),

  fetchPayments: async (token, logoutCallback) => {
    if (!token) return;

    set({ isLoading: true, error: null });

    const {
      statusFilter,
      searchId,
      searchMerchant,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortField,
      sortOrder,
      page,
      limit,
    } = get();

    const params = new URLSearchParams();

    if (statusFilter !== "all") {
      params.append("status", statusFilter);
    }
    if (searchId.trim()) {
      params.append("id", searchId.trim());
    }
    if (searchMerchant.trim()) {
      params.append("merchant", searchMerchant.trim());
    }
    if (startDate) {
      params.append("start_date", startDate);
    }
    if (endDate) {
      params.append("end_date", endDate);
    }
    if (minAmount.trim()) {
      params.append("min_amount", minAmount.trim());
    }
    if (maxAmount.trim()) {
      params.append("max_amount", maxAmount.trim());
    }
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const sortPrefix = sortOrder === "desc" ? "-" : "";
    params.append("sort", `${sortPrefix}${sortField}`);

    try {
      const res = await fetch(
        `${config.backendApiUrl}/dashboard/v1/payments?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const paymentList = data.payments || [];
        const totalCount = typeof data.total === "number" ? data.total : paymentList.length;

        set({
          payments: paymentList,
          total: totalCount,
          totalCompleted: data.total_completed ?? 0,
          totalProcessing: data.total_processing ?? 0,
          totalFailed: data.total_failed ?? 0,
          page: data.page || page,
          limit: data.limit || limit,
        });
      } else if (res.status === 401) {
        logoutCallback();
      } else {
        throw new Error(`Server returned code ${res.status}`);
      }
    } catch (err: any) {
      console.error("API connection failed:", err);
      set({
        payments: [],
        total: 0,
        error: "Unable to connect to live payments API. Please check if the Go backend is running.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
export default usePaymentStore;
