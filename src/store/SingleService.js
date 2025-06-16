import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';
import { Lang } from '../functions/Token';

export const useServiceStore = create((set) => ({
    currentService: {},
    loading: true,

    fetchService: async (servId, token) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${baseURL}/show-service/${servId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Locale": Lang
                },
            });
            set({ currentService: response?.data?.data?.service, loading: false });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!', { duration: 1000 });
            set({ loading: false });
        }
    },
}));
