import {z} from 'zod';

export const UpdateEmployeeProfileSchema = z.object({
    name: z.string().min(1,{message: 'Required'}),
    email: z.string().email({message: 'Invalid Email Address'}),
    phone: z.string().min(1,{message: 'Required'}),
    citizenship:  z.string().min(1,{message: 'Required'}),
    official_id_or_passport: z.any(),
    image: z.any(),
    country_id: z.any(),
    city_id: z.any(),
    full_address: z.string().min(1,{message: 'Required'}),
});