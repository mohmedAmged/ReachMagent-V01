import {z} from 'zod';

export const BusinessRegisterSchema = z.object({
    company_name: z.string().min(1,{message: 'Required'}),
    company_email: z.string().email({message: 'Invalid Email Address'}),
    company_main_type: z.any(),
    registeration_number: z.string().min(1,{message: 'Required'}),
    documents: z.any(),
    category_id: z.string().min(1,{message: 'Required'}),
    sub_category_id: z.string().min(1,{message: 'Required'}),
    industry_id: z.string().min(1,{message: 'Required'}),
    activity_id: z.any(),
    sub_activity_id: z.any(),
    logo:  z.any(),

    company_country_id: z.string().min(1,{message: 'Required'}),
    company_city_id: z.string().min(1,{message: 'Required'}),
    company_full_address: z.string().min(1,{message: 'Required'}),

    employee_name: z.string().min(1,{message: 'Required'}),
    employee_email: z.string().email({message: 'Invalid Email Address'}),
    employee_phone: z.string().min(1,{message: 'Required'}),
    employee_title: z.string().min(1,{message: 'Required'}),
    employee_country_id: z.string().min(1,{message: 'Required'}),
    employee_city_id: z.string().min(1,{message: 'Required'}),
    employee_full_address: z.string().min(1,{message: 'Required'}),
    employee_citizenship: z.string().min(1,{message: 'Required'}),
    official_id_or_passport:  z.any(),
    employee_password: z.string().min(1,{message: 'Required'}),

    is_benifical_owner: z.boolean().refine(val => val === true, {message: "You must be the Owner of the company",}),
    comfirm_policies: z.boolean().refine(val => val === true, {message: "You must accept the terms and conditions",}),
});