import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { ResetPasswordStep2Schema } from '../../validation/ResetPasswordStep2Schema';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function ResetPasswordForm() {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType');
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState:{errors , isSubmitting}
    } = useForm({
        defaultValues: {
            email: '',
            otp: '',
            [loginType === 'employee' ? 'password' : 'new_password']: '',
            [loginType === 'employee' ? 'password_confirmation' : 'new_password_confirmation']: '',
        },
        resolver: zodResolver(ResetPasswordStep2Schema(loginType)),
    });

    const onSubmit = async (data) => {
        const toastId = toast.loading('Please Wait...');
        await axios.post(`${baseURL}/${loginType}/reset-password`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            toast.success(`${response?.data?.message}.`,{
                id: toastId,
                duration: 1000
            });
            reset();
            navigate('/login');
        }).catch(error => {
            Object.keys(error?.response?.data?.errors).forEach((key) => {
                setError(key, {message: error?.response?.data?.errors[key][0]});
            });
            toast.error(error?.response?.data?.message,{
                id: toastId,
                duration: 2000
            });
        });
    };

    return (
        <div className='signUpForm__mainSec py-5 mb-5'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className='signUpForm__mainContent'>
                            <div className='row'>
                                <h3 className="col-12 text-center pt-5 signUpForm__head">
                                    {t('ResetPasswordPage.pageHeaderText')}
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className='row justify-content-center'>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="resetPasswordStep2Email">
                                            {t('ForgetPasswordPage.emaiFormInput')} <span className="requiredStar">*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='resetPasswordStep2Email'
                                            placeholder={t('ForgetPasswordPage.emaiFormInputPlaceholder')} 
                                            {...register('email')}
                                            className={`form-control signUpInput ${errors.email && 'inputError'}`}
                                        />
                                        {
                                            errors.email
                                            &&
                                            (<span className='errorMessage'>{errors.email.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="resetPasswordOTP">
                                            {t('ResetPasswordPage.otpFormInput')}  <span className="requiredStar">*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='resetPasswordOTP'
                                            placeholder={t('ResetPasswordPage.otpFormInputPlaceholder')}
                                            {...register('otp')}
                                            className={`form-control signUpInput ${errors.otp && 'inputError'}`}
                                        />
                                        {
                                            errors.otp
                                            &&
                                            (<span className='errorMessage'>{errors.otp.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="resetPasswordNewPassword">
                                            {t('ResetPasswordPage.newPassFormInput')} <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={`${showPassword ? 'text' : 'password'}`}
                                                id='resetPasswordNewPassword'
                                                placeholder={t('PersonalSignUpPage.passwordFormInputPlaceholder')}
                                                {...register(loginType === 'employee' ? 'password' : 'new_password')}
                                                className={`form-control signUpInput ${errors?.new_password && 'inputError'}`}
                                            />
                                            <div className={`${Lang === 'ar' ? 'leftShowPasssord_RTL' : 'leftShowPasssord'}`} onClick={()=>setShowPassword(!showPassword)}>
                                            {
                                                showPassword ?
                                                <i className="bi bi-eye-slash"></i>
                                                :
                                                <i className="bi bi-eye-fill"></i>
                                            }
                                            </div>
                                        </div>
                                        {
                                            errors.new_password
                                            &&
                                            (<span className='errorMessage'>{errors.new_password.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInPassword">
                                            {t('PersonalSignUpPage.ConfirmPasswordFormInput')} <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={`${showConfirmPassword ? 'text' : 'password'}`}
                                                id='signInPassword'
                                                placeholder={t('PersonalSignUpPage.ConfirmPasswordFormInput')}
                                                {...register(loginType === 'employee' ? 'password_confirmation' : 'new_password_confirmation')}
                                                className={`form-control signUpInput ${errors?.new_password_confirmation && 'inputError'}`}
                                            />
                                            <div className={`${Lang === 'ar' ? 'leftShowPasssord_RTL' : 'leftShowPasssord'}`} onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                                            {
                                                showConfirmPassword ?
                                                <i className="bi bi-eye-slash"></i>
                                                :
                                                <i className="bi bi-eye-fill"></i>
                                            }
                                            </div>
                                        </div>
                                        {
                                            errors.new_password_confirmation
                                            &&
                                            (<span className='errorMessage'>{errors.new_password_confirmation.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-12 text-center mt-3 signUp__submitBtn">
                                        <input
                                            disabled={isSubmitting}
                                            type="submit"
                                            value={t('ResetPasswordPage.confirmChangesBtn')}
                                        />
                                    </div>
                                    <div className="col-12 text-dark text-center">
                                        <NavLink className="gotoLoginLink ms-2" to="/forget-password">
                                            {t('ResetPasswordPage.senMessageAgainBtn')}
                                        </NavLink>
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
