import Cookies from "js-cookie";
export const Token = Cookies.get("authToken");
export const Lang = Cookies.get("i18next");