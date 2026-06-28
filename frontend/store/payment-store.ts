import { create } from "zustand";
import config from "@/config";

interface Payment {
  id: string;
  merchant: string;
  amount: string;
  status: string;
  created_at: string;
}

type SortField = "created_at" | "amount";
type SortOrder = "asc" | "desc";

interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  statusFilter: string;
  searchId: string;
  sortField: SortField;
  sortOrder: SortOrder;

  setStatusFilter: (val: string) => void;
  setSearchId: (val: string) => void;
  setSortField: (val: SortField) => void;
  setSortOrder: (val: SortOrder) => void;
  fetchPayments: (token: string | null, logoutCallback: () => void) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,
  statusFilter: "all",
  searchId: "",
  sortField: "created_at",
  sortOrder: "desc",

  setStatusFilter: (val) => set({ statusFilter: val }),
  setSearchId: (val) => set({ searchId: val }),
  setSortField: (val) => set({ sortField: val }),
  setSortOrder: (val) => set({ sortOrder: val }),

  fetchPayments: async (token, logoutCallback) => {
    if (!token) return;

    set({ isLoading: true, error: null });

    const { statusFilter, searchId, sortField, sortOrder } = get();
    const params = new URLSearchParams();

    if (statusFilter !== "all") {
      params.append("status", statusFilter);
    }

    if (searchId.trim()) {
      params.append("id", searchId.trim());
    }

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
        const paymentList = Array.isArray(data) ? data : data.payments || [];
        set({ payments: paymentList });
      } else if (res.status === 401) {
        logoutCallback();
      } else {
        throw new Error(`Server returned code ${res.status}`);
      }
    } catch (err: any) {
      console.error("API connection failed:", err);
      set({
        payments: [],
        error: "Unable to connect to live payments API. Please check if the Go backend is running.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
export default usePaymentStore;
