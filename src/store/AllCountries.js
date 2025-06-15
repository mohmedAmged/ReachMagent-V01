import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import {  Lang, Token } from "../functions/Token";
// import Cookies from "js-cookie";

export const GetAllCountriesStore = create((set, get) => ({
    countries: [],
    allowedCountries: [],
    countriesError: null,
    countriesLoading: true,
    lastFetched: null,
    getAllCountries: async () => {
        const { lastFetched, countries } = get();
        const now = new Date().getTime();
        if (countries.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ countriesLoading: false });
            return;
        };
        // const Lang = Cookies.get("i18next");
        // console.log(Lang);
        set({ countriesLoading: true });
        await axios.get(`${baseURL}/countries?t=${now}`, {
            headers: Token ? 
                { 
                    Authorization: `Bearer ${Token}`,
                    "Locale": Lang 
                } 
                :
                {
                        Accept: "application/json",
                        "Locale": Lang
                }
        })
            .then(res => set(() => (
                {
                    countries: res?.data?.data?.countries,
                    countriesError: null,
                    countriesLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    countries: [],
                    countriesError: err?.response?.data?.message,
                    countriesLoading: false,
                    lastFetched: null,
                }
            )));
    },
    getAllAllowedCountries: async () => {
        const { lastFetched, allowedCountries } = get();
        const now = new Date().getTime();
        if (allowedCountries.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ countriesLoading: false });
            return;
        }
        set({ countriesLoading: true });
        await axios.get(`${baseURL}/company-countries?t=${now}`, {
            headers: Token ? 
            { 
                Authorization: `Bearer ${Token}`,
                "Locale": Lang 
            } 
            :
            {
                    Accept: "application/json",
                    "Locale": Lang
            }
        })
            .then(res => set(() => (
                {
                    allowedCountries: res?.data?.data?.countries,
                    countriesError: null,
                    countriesLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    allowedCountries: [],
                    countriesError: err?.response?.data?.message,
                    countriesLoading: false,
                    lastFetched: null,
                }
            )));
    },
}));
