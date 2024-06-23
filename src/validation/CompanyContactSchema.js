import {z} from 'zod';

export const CompanyContactSchema = z.object({
    fullName: z.string().min(3, { message: 'Your Name must be more than 3 Characters'}),
    phoneNumber: z.string().min(8,{message: 'Phone Number must be more than 8 numbers'}),
    email: z.string().email({message: 'Invalid Email Address'}),
    description: z.string().min(3,{message: 'Description must be more than 3 Characters'})
});