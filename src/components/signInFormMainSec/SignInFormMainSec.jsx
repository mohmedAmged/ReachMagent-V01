import React, { useState } from 'react';
import './signInFormMain.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../../validation/LoginSchema';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useNavigate, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function SignInFormMainSec({ loginType, setLoginType }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(LoginSchema),
    });

    const handleChangeLoginType = (type) => {
        localStorage.setItem('loginType', type);
        setLoginType(localStorage.getItem('loginType'));
    };

    const onSubmit = async (data) => {
        const toastId = toast.loading('Please Wait...');
        await axios.post(`${baseURL}/${loginType}/login?t=${new Date().getTime()}`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            const token = response?.data?.data?.token;
            const userData = response?.data?.data?.user;
            console.log(userData);
            
            if (token) {
                Cookies.set('authToken', token, { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 });

                if (loginType === 'user') {
                    Cookies.set('verified', userData?.verified, { expires: 365 });
                }
                const slugCompletion = loginType === 'user' ? 'user/profile' : 'employee/show-profile';
                const fetchData = async () => {
                    try {
                        const res = await axios.get(`${baseURL}/${slugCompletion}?t=${new Date().getTime()}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });
                        loginType === 'employee' ?
                            Cookies.set('currentLoginedData', JSON.stringify(res?.data?.data), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
                            :
                            Cookies.set('currentLoginedData', JSON.stringify(res?.data?.data?.user), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
                            toast.success(`${response?.data?.message}.`, {
                                id: toastId,
                                duration: 1000
                            });
                            if ( loginType === 'user' && !userData?.verified) {
                                setTimeout(() => {
                                    navigate('/user-verification');
                                }, 1000);
                            }else {
                                setTimeout(() => {
                                    navigate('/');
                                    window.location.reload();
                                }, 1000);
                            };
                           
                    } catch (error) {
                        toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
                    };
                };
                fetchData();
                
               
                reset();
            };
            
        })
            .catch(error => {
                if (error?.response?.data?.errors) {
                    Object.keys(error.response.data.errors).forEach((key) => {
                        setError(key, { message: error.response.data.errors[key] });
                    });
                };
                toast.error(error?.response?.data?.errors?.password || error?.response?.data?.message, {
                    id: toastId,
                    duration: 2000,
                });
            });
    };

    return (
        <div className='signUpForm__mainSec py-5 mb-5'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <ul className='row loginToggler'>
                            <li className={`col-md-3 cursorPointer ${loginType === 'user' && 'active'}`} onClick={() => handleChangeLoginType('user')}>
                                {t('LoginPage.loginTypeUser')}
                            </li>
                            <li className={`col-md-3 cursorPointer ${loginType === 'employee' && 'active'}`} onClick={() => handleChangeLoginType('employee')}>
                                {t('LoginPage.loginTypeBusiness')}
                            </li>
                        </ul>
                        <div className="signUpForm__mainContent">
                            <div className="row">
                                <h3 className="col-12 text-center pt-5 signUpForm__head">
                                    {loginType === 'user' ? `${t('LoginPage.loginAsUser')}` : `${t('LoginPage.loginAsBusiness')}`}
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className='row justify-content-center mt-3'>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInEmailAddress">
                                            {t('LoginPage.loginEmailInput')} <span className="requiredStar">*</span>
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
                                            {t('LoginPage.loginPasswordInput')} <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={`${showPassword ? 'text' : 'password'}`}
                                                id='signInPassword'
                                                placeholder={t('LoginPage.loginPasswordInputPlaceholder')}
                                                {...register('password')}
                                                className={`form-control signUpInput ${errors.password ? 'inputError' : ''}`}
                                            />
                                            <div className={` ${Lang === 'ar' ? "leftShowPasssord_RTL" : "leftShowPasssord"}`} onClick={() => setShowPassword(!showPassword)}>
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
                                            value={t('LoginPage.loginBtn')}
                                        />
                                        {
                                            // loginType === 'user' &&
                                            <div className="resetPasswordNavigatinoLink text-end">
                                                <NavLink className='gotoLoginLink' to='/forget-password'>{t('LoginPage.forgetPassword')}</NavLink>
                                            </div>
                                        }
                                    </div>

                                    <div className="col-12 text-dark text-center mt-3">
                                        <span>{t('LoginPage.DontHaveAcc')}</span>
                                        <NavLink className="gotoLoginLink ms-2" to="/personalsignUp">
                                            {t('LoginPage.createNewAcc')}
                                        </NavLink>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
