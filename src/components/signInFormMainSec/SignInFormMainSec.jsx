import React, { useState } from 'react'
import './signInFormMain.css'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../../validation/LoginSchema';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export default function SignInFormMainSec() {
    const [showPassword,setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        watch,
        setValue,
        reset,
        formState:{errors , isSubmitting}
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async(data) => {
        const toastId = toast.loading('Please Wait...');
        await axios.post(`${baseURL}/user/login`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log(response)
            toast.success(response?.data?.message,{
                id: toastId,
                duration: 2000
            });
            navigate('/SignIn');
            reset();
        })
        .catch(error => {
            console.log(error)
            Object.keys(error?.response?.data?.errors).forEach((key) => {
            setError(key, {message: error?.response?.data?.errors[key][0]});
            });
            window.scrollTo({top: 550});
            toast.error(error?.response?.data?.message,{
                id: toastId,
                duration: 2000
            });
        });
    };

    return (
        <div className='signUpForm__mainSec py-5 mb-5'>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="signUpForm__mainContent">
                            <div className="row">
                                <h3 className="col-12 text-center py-5 signUpForm__head">
                                    Login Information
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className='row justify-content-center'>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInEmailAddress">
                                            E-mail Address <span className="requiredStar">*</span>
                                        </label>
                                        <input 
                                            type='text'
                                            id='signInEmailAddress'
                                            placeholder='ex: admin@gmail.com'
                                            {...register('email')}
                                            className={`form-control signUpInput ${errors.email ? 'inputError' : ''}`}
                                        />
                                        {
                                            errors.email
                                            &&
                                            (<span className='errorMessage'>{errors.email.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInPassword">
                                            Password <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input 
                                                type={`${showPassword ? 'text' : 'password'}`}
                                                id='signInPassword'
                                                placeholder='Enter 8-digit password'
                                                {...register('password')}
                                                className={`form-control signUpInput ${errors.password ? 'inputError' : ''}`}
                                            />
                                            <div className="leftShowPasssord" onClick={()=>setShowPassword(!showPassword)}>
                                            {
                                                showPassword ?
                                                <i className="bi bi-eye-slash"></i>
                                                :
                                                <i className="bi bi-eye-fill"></i>
                                            }
                                            </div>
                                        </div>
                                            {
                                                errors.password
                                                &&
                                                (<span className='errorMessage'>{errors.password.message}</span>)
                                            }
                                    </div>
                                    <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                                        <input
                                            disabled={isSubmitting}
                                            type="submit"
                                            value={'Login'} 
                                        />
                                    </div>
                                    <div className="col-12 text-dark text-center">
                                        <span>Don't Have and account?</span>
                                        <a className="gotoLoginLink ms-2" href="/personalsignUp">
                                            Create New Account
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}