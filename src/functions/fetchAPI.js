import axios from "axios";
import { baseURL } from "./baseUrl";

export const getDataFromAPI = async (slug)=>{
    const response = await axios.get(`${baseURL}/${slug}`);
    return response?.data?.data;
};