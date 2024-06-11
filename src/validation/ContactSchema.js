import * as yup from "yup";

export const ContactSchema = yup.object().shape({
    name: yup
    .string(),
    email: yup
    .string(),
    phone: yup
    .string(),
    description: yup
    .string()
});