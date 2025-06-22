import axios from "axios";
import { baseURL } from "./baseUrl";
import { Lang } from "./Token";

export const getDataFromAPI = async (slug, auth) => {
    const response = await axios.get(`${baseURL}/${slug}?t=${new Date().getTime()}`, auth, {
            headers:{
              "Locale": Lang
            }
          });
    return response?.data?.data;
};