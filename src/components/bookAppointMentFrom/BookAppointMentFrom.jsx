import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookAppointMentSchema } from '../../validation/BookAppointShema';
import './bookAppointMentFromStyle.css'
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function BookAppointMentFrom({ companyId, company, token }) {
    const [selectedAppointMent, setSelectedAppointMent] = useState({});
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            date: '',
            time: '',
            reason: '',
        },
        resolver: zodResolver(BookAppointMentSchema),
    });

    const submitHandler = async (data) => {
        data.company_id = companyId;
        console.log(data)
        const toastId = toast.loading('Loading...');
        await axios.post(`${baseURL}/user/book-appointment`, data, {
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                console.log(res?.data?.data);
                toast.success(res?.data?.message || 'Booked Successfully!', {
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(err => {
                if (err?.response?.data?.errors) {
                    Object.keys(err.response.data.errors).forEach((key) => {
                        setError(key, { message: err.response.data.errors[key][0] });
                    });
                };
                console.log(err?.response.data?.message)
                toast.error(err?.response.data?.message || 'Something Went Wrong!', {
                    id: toastId,
                    duration: 1000
                });
            });
    };

    return (
        <div className='container'>
            <form onSubmit={handleSubmit(submitHandler)} className="row bookAppointMentForm">
                <div className="col-12">
                    <h4 className='fs-2 text-center mb-5'>Book AppointMent</h4>
                </div>
                <div className=' col-md-6 mb-4'>
                    <label htmlFor={`BookAppointMentDate`}>
                        DateFrom - DateTo
                    </label>
                    <select
                        className={`form-select mt-2 w-100`}
                        id={`BookAppointMentDate`}
                        defaultValue={''}
                        onChange={(e) => {
                            setSelectedAppointMent(company?.company?.appointments[e.target.value]);
                        }}
                    >
                        <option disabled value="">(From) - (To)</option>
                        {
                            company?.company?.appointments?.map((appointment, idx) => (
                                <option key={idx} value={idx}>({appointment?.appointmentDateFrom}) - ({appointment?.appointmentDateTo}) </option>
                            ))
                        }
                    </select>
                </div>
                <div className=' col-md-6 mb-4'>
                    <label htmlFor={`BookAppointMentDataAndTime`}>
                        DateFrom - Time
                    </label>
                    <select
                        className={`form-select mt-2 w-100`}
                        id={`BookAppointMentDataAndTime`}
                        defaultValue={''}
                        onChange={(e) => {
                            const selectedSlot = selectedAppointMent?.slots?.[e.target.value];
                            setValue('date', selectedSlot?.date);
                            setValue('time', selectedSlot?.time);
                        }}
                    >
                        <option disabled value="">(Date) - (Time)</option>
                        {
                            selectedAppointMent?.slots?.map((slot, idx) => (
                                (slot?.booked === false) &&
                                <option key={idx} value={idx}>({slot.date}) - ({slot?.time})</option>
                            ))
                        }
                    </select>
                    {
                        errors?.date?.message &&
                        <span className="errorMessage">{errors?.date?.message}</span>
                    }
                    {
                        errors?.time?.message &&
                        <span className="errorMessage ms-2">{errors?.time?.message}</span>
                    }
                </div>
                <div className="col-md-12 mb-4">
                    <label htmlFor="reasonForAppointMent"></label>
                    <textarea
                        className={`form-control ${errors?.reason?.message ? 'inputError' : ''}`}
                        id="reasonForAppointMent"
                        placeholder='Type Your Reason'
                        {...register('reason')}
                    ></textarea>
                    {
                        errors?.reason?.message &&
                        <span className='errorMessage'>{errors?.reason?.message}</span>
                    }
                </div>
                <div className="col-md-12 m-auto">
                    <input
                        className='contactCompany__form-submitBtn m-auto w-auto px-4 py-2'
                        type='submit'
                        id="submitCompanyFormBtn"
                        name='submitCompanyFormBtn'
                        value={isSubmitting ? 'Sending ...' : 'Book AppointMent'}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
};
