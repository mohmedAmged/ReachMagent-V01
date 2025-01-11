import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useActivePackageStore = create((set, get) => ({
    loading: true,
    features: {},
    message: '',
    unAuth: false,

    fetchActivePackage: async (token, loginType) => {
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/active-company-package`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set({
                features: response?.data?.data?.features,
                message: response?.data?.message || '',
                loading: false,
            });
        } catch (error) {
            if (error?.response?.status === 401) {
                set({ unAuth: true });
                toast.error('Unauthorized access. Please log in again.');
            } else {
                toast.error(error?.response?.data?.message || 'Something went wrong!');
            }
            set({ loading: false });
        }
    },

    resetStore: () => {
        set({
            loading: false,
            features: {},
            message: '',
            unAuth: false,
        });
    },
}));
