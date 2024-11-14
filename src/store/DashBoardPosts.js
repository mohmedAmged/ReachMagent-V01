import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardPostsStore = create((set, get) => ({
    posts: [],
    loading: true,
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    lastFetched: null,

    fetchPosts: async (token, loginType, page = 1) => {
        const { lastFetched } = get();
        const now = Date.now();
        const threeMinutes = 3 * 60 * 1000;

        if (lastFetched && now - lastFetched < threeMinutes) {
            set({ loading: false });
            return;
        }

        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-posts?page=${page}&t=${now}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                posts: response?.data?.data?.posts,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
                lastFetched: now,
            });
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    deletePost: async (token, loginType, postId) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-post/${postId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response?.data?.message);
            set((state) => ({
                posts: state.posts.filter((post) => post.postId !== postId),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting post');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
}));
