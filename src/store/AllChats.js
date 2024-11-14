import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

const loginType = localStorage.getItem('loginType');
const slug = loginType === 'user' ? `${loginType}/my-chats` : `${loginType}/company-chats`;

export const GetAllChatsStore = create((set) => ({
    chats: [],
    chatsError: null,
    chatsLoading: true,
    allRead: true,
    userNowInfo: null,
    getAllChats: async () => {
        await axios.get(`${baseURL}/${slug}?t=${new Date().getTime()}`, {
            headers: Token ? { Authorization: `Bearer ${Token}` } : {}
        })
            .then(res => set(() => (
                {
                    chats: res?.data?.data?.chats,
                    userNowInfo: res?.data?.data?.user,
                    allRead: res?.data?.data?.all_read,
                    chatsError: null,
                    chatsLoading: false,
                }
            )))
            .catch(err => set(() => (
                {
                    chats: [],
                    chatsError: err?.response?.data?.message,
                    chatsLoading: false,
                    allRead: true,
                    userNowInfo: null,
                }
            )));
    },
}));