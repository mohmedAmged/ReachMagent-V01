import {z} from 'zod';

export const RegisterSchema = z.object({
    firstName: z.string().min(1,{message: 'Required'}),
    lastName: z.string().min(1,{message: 'Required'}),
    country: z.string().min(1,{message: 'Required'}),
    userName: z.string().min(1,{message: 'Required'}),
    mobileNumber: z.string().min(1,{message: 'Required'}),
    email: z.string().email({message: 'Invalid Email Address'}),
    password: z.string().min(8,{message: 'Required, must be more than 8 characters'}),
    addressLine1: z.string().min(1,{message: 'Required'}),
    addressLine2: z.string(),
    city: z.string().min(1,{message: 'Required'}),
    confirmPassword: z.string()
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
    ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Passwords must match',
    });
}});
