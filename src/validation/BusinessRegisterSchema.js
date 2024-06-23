import {z} from 'zod';

export const BusinessRegisterSchema = z.object({
    businessName: z.string().min(1,{message: 'Required'}),
    businessTitle: z.string().min(1,{message: 'Required'}),
    businessNumber: z.string().min(1,{message: 'Required'}),
    businessIndustry: z.string().min(1,{message: 'Required'}),
    businessCategory: z.string().min(1,{message: 'Required'}),
    businessSubCategory: z.string().min(1,{message: 'Required'}),
    businessFirstName: z.string().min(1,{message: 'Required'}),
    businessLastName: z.string().min(1,{message: 'Required'}),
    businessContactTitle: z.string().min(1,{message: 'Required'}),
    other: z.string(),
    country: z.string().min(1,{message: 'Required'}),
    businessCountry: z.string().min(1,{message: 'Required'}),
    userName: z.string().min(1,{message: 'Required'}),
    mobileNumber: z.string().min(1,{message: 'Required'}),
    email: z.string().email({message: 'Invalid Email Address'}),
    password: z.string().min(8,{message: 'Required, must be more than 8 characters'}),
    addressLine1: z.string().min(1,{message: 'Required'}),
    addressLine2: z.string(),
    city: z.string().min(1,{message: 'Required'}),
    citizenship: z.string().min(1,{message: 'Required'}),
    citizenshipFile: z.any(),
    confirmCheckBox: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions",
    }),
    confirmPassword: z.string()}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            path: ['confirmPassword'],
            message: 'Passwords must match',
        });
    }});