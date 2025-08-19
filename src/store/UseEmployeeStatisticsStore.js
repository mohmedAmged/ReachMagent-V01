import { create } from "zustand";
import axios from "axios";
import { Lang, Token } from "../functions/Token";
import { baseURL } from "../functions/baseUrl";

const useStatisticsStore = create((set) => ({
  statistics: null,
  loading: false,
  error: null,

  // Fetch statistics with token
  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${baseURL}/employee/statistics?t=${new Date().getTime()}`, {
        headers: {
            Authorization: `Bearer ${Token}`,
            "Locale":Lang
        },
      });

      set({ statistics: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch statistics",
        loading: false,
      });
    }
  },
}));

export default useStatisticsStore;
