import React, { useEffect, useState } from 'react'
import './myProfileFrom.css'
import { scrollToTop } from '../../functions/scrollToTop';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateEmployeeProfileSchema } from '../../validation/UpdateEmployeeProfile';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function MyProfileForm({ token, imgChanged, currnetImageUpdateFile, setCurrentImageUpdateError, setCurrentImage, currentUserLogin, setProfileUpdateStatus, profileUpdateStatus, countries }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentCities, setCurrentCities] = useState([]);
    const [defaultChosenCity, setDefaultChosenCity] = useState(null);
    const loginType = localStorage.getItem('loginType');
    const loginTypeEmployeeCondition = loginType === 'employee';
    const currentChosenCountry = countries?.find(el => el?.name === currentUserLogin?.country);
    const {
        register,
        handleSubmit,
        setError,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: currentUserLogin?.name,
            email: currentUserLogin?.email,
            phone: currentUserLogin?.phone,
            citizenship: currentUserLogin?.citizenship,
            official_id_or_passport: '',
            image: currnetImageUpdateFile,
            country_id: currentChosenCountry?.id,
            city_id: defaultChosenCity || '',
            full_address: currentUserLogin?.fullAddress,
            address_one: '',
            address_two: '',
            phone_code: currentUserLogin?.phone_code
        },
        resolver: zodResolver(UpdateEmployeeProfileSchema),
    });
console.log(currentUserLogin);

    const citiesInsideCurrentCountry = async (chosenCountry) => {
        try {
            const response = await axios.get(`${baseURL}/countries/${chosenCountry?.code}`, {
                        headers: 
                            { 
                                "Locale": Lang 
                            } 
                        });
            const cities = response?.data?.data?.cities || [];
            setCurrentCities(cities);

            const defaultCity = cities.find(city => city?.cityName === currentUserLogin?.city);
            setDefaultChosenCity(defaultCity?.cityId || null);
        } catch (error) {
            toast.error(`${error?.response?.data?.message || error?.message}`);
        };
    };
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'country_id') {
                const currentCountry = countries?.find(country => country?.id === +value?.country_id);
                if (currentCountry) {
                    citiesInsideCurrentCountry(currentCountry); // Fetch cities
                    setValue('city_id', '');
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, countries, setValue])

    useEffect(() => {
        if (defaultChosenCity) {
            setValue('city_id', defaultChosenCity);
        }
    }, [defaultChosenCity]);
    useEffect(() => {
        if (currentChosenCountry) {
            citiesInsideCurrentCountry(currentChosenCountry)
        }
    }, [currentChosenCountry])

    useEffect(() => {
        setValue('image', currnetImageUpdateFile);
    }, [currnetImageUpdateFile])

    useEffect(() => {
        const savedData = Cookies.get('currentLoginedData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            loginTypeEmployeeCondition ?
                (
                    Object.keys(parsedData).forEach(async key => {
                        if (key === 'fullAddress') {
                            setValue('full_address', parsedData[key]);
                        } else if (key === 'city') {
                            setValue('city_id', parsedData[key]);
                        } else if (key !== 'country' && key !== 'officialIdOrPassport' && key !== 'image') {
                            setValue(key, parsedData[key]);
                        };
                    })
                )
                :
                (
                    Object.keys(parsedData).forEach(async key => {
                        if (key === 'addressOne') {
                            setValue('address_one', parsedData[key]);
                        } else if (key === 'addressTwo') {
                            setValue('address_two', parsedData[key]);
                        } else if (key === 'city') {
                            setValue('city_id', parsedData[key]);
                        } else if (key !== 'country' && key !== 'officialIdOrPassport' && key !== 'image') {
                            setValue(key, parsedData[key]);
                        };
                    })
                )

            setCurrentImage(parsedData?.image);
        };
    }, []);

    const onSubmit = async (data) => {
        const toastId = toast.loading('Please Wait...');
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key !== 'image' && key !== 'official_id_or_passport') {
                formData.append(key, data[key]);
            };
        });
        if (imgChanged && data.image[0]) {
            formData.append('image', data.image[0]);
        };
        await axios.post(`${baseURL}/${loginType}/update-profile?t=${new Date().getTime()}`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        }).then(response => {
            toast.success(`${response?.data?.message}.`, {
                id: toastId,
                duration: 1000,
            });
            loginType === 'employee' ?
                Cookies.set('currentLoginedData', JSON.stringify(response?.data?.data), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
                :
                Cookies.set('currentLoginedData', JSON.stringify(response?.data?.data?.user), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
            localStorage.setItem('updatingProfile', 'notUpdating');
            if (loginType === 'user') {
                if (response?.data.data?.user?.verified) {
                    window.location.reload();
                } else {
                    navigate('/user-verification');
                };
            } else {
                window.location.reload();
            };
        })
            .catch(error => {
                if (error?.response?.data?.errors) {
                    Object.keys(error.response.data.errors).forEach((key) => {
                        setError(key, { message: error.response.data.errors[key][0] });
                    });
                };
                toast.error(error?.response?.data?.message, {
                    id: toastId,
                    duration: 2000
                });
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='profileForm__handler my-4' >
            <div className="mt-2 profileFormInputItem cityContainerProfileForm">
                <label htmlFor="dashboardEmployeeName">{t('DashboardProileSettingsPage.firstNameFormInput')}</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 ${errors?.name ? 'inputError' : ''}`}
                    {...register('name')}
                    type="text"
                    disabled={profileUpdateStatus === 'notUpdating'}
                />
                {
                    errors?.name
                    &&
                    (<span className='errorMessage'>{errors?.name?.message}</span>)
                }
            </div>
            <div className="mt-2 profileFormInputItem cityContainerProfileForm">
                <label htmlFor="dashboardEmployeePhone">{t('DashboardProileSettingsPage.phoneNumberFormInput')}</label>
                <input
                    id='dashboardEmployeePhone'
                    className={`form-control signUpInput mt-2 ${errors?.phone ? 'inputError' : ''}`}
                    {...register('phone')}
                    type="number"
                    disabled={profileUpdateStatus === 'notUpdating'}
                />
                {
                    errors?.phone
                    &&
                    (<span className='errorMessage'>{errors?.phone?.message}</span>)
                }
            </div>
            <div className="mt-2 profileFormInputItem cityContainerProfileForm">
                <label htmlFor="dashboardEmployeeEmail">{t('DashboardProileSettingsPage.emailAddressFormInput')}</label>
                <input
                    id='dashboardEmployeeEmail'
                    className={`form-control signUpInput mt-2 ${errors?.email ? 'inputError' : ''}`}
                    {...register('email')}
                    type="text"
                    disabled={profileUpdateStatus === 'notUpdating'}
                />
                {
                    errors?.email
                    &&
                    (<span className='errorMessage'>{errors?.email?.message}</span>)
                }
            </div>
            <div className="mt-2 profileFormInputItem cityContainerProfileForm">
                <label htmlFor="dashboardEmployeeCountry">{t('DashboardProileSettingsPage.countryFormInput')}</label>
                {
                    (profileUpdateStatus === 'notUpdating') ?
                        <input
                            id='dashboardEmployeeCountry'
                            className='form-control signUpInput mt-2'
                            value={currentUserLogin?.country}
                            type="text"
                            disabled={true}
                        />
                        :
                        <>
                            <select
                                className={`form-select signUpInput mt-2 ${errors?.country_id ? 'inputError' : ''} ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                defaultValue={currentChosenCountry?.id || ''}
                                {...register('country_id')}
                                id="dashboardEmployeeCountry"
                            >
                                <option disabled value="">{t('DashboardProileSettingsPage.countryFormInputPlaceholder')}</option>
                                {
                                    countries?.map(country => (
                                        <option key={country?.id} value={country?.id}>{country?.name}</option>
                                    ))
                                }
                            </select>
                            {
                                errors?.country_id
                                &&
                                (<span className='errorMessage'>{errors?.country_id?.message}</span>)
                            }
                        </>
                }
            </div>
            <div className="mt-2 profileFormInputItem cityContainerProfileForm">
                <label htmlFor="dashboardEmployeeCity">{t('DashboardProileSettingsPage.cityFormInput')}</label>
                {
                    (profileUpdateStatus === 'notUpdating') ?
                        <input
                            id='dashboardEmployeeCity'
                            className='form-control signUpInput mt-2'
                            value={currentUserLogin?.city}
                            type="text"
                            disabled={true}
                        />
                        :
                        <>
                            <select
                                className={`form-select signUpInput mt-2 ${errors?.city_id ? 'inputError' : ''} ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                // defaultValue={currentUserLogin?.city}
                                {...register('city_id')}
                                id="dashboardEmployeeCity"
                            >
                                <option disabled value="">{t('DashboardProileSettingsPage.cityFormInputPlaceholder')}</option>
                                {
                                    currentCities?.map(city => (
                                        <option key={city?.cityId} value={city?.cityId}>{city?.cityName}</option>
                                    ))
                                }
                            </select>
                            {
                                errors?.city_id
                                &&
                                (<span className='errorMessage'>{errors?.city_id?.message}</span>)
                            }
                        </>
                }
            </div>
            {
                (localStorage.getItem('loginType') === 'user') ?
                    <>
                        <div className="mt-2 profileFormInputItem cityContainerProfileForm">
                            <label htmlFor="dashboardAddress_one">{t('DashboardProileSettingsPage.addressOneFormInput')}</label>
                            <input
                                id='dashboardAddress_one'
                                className={`form-control signUpInput mt-2 ${errors?.address_one ? 'inputError' : ''}`}
                                {...register('address_one')}
                                type="text"
                                disabled={profileUpdateStatus === 'notUpdating'}
                            />
                            {
                                errors?.address_one
                                &&
                                (<span className='errorMessage'>{errors?.address_one?.message}</span>)
                            }
                        </div>
                        <div className="mt-2 profileFormInputItem cityContainerProfileForm">
                            <label htmlFor="dashboardAddress_two">{t('DashboardProileSettingsPage.addressTwoFormInput')}</label>
                            <input
                                id='dashboardAddress_two'
                                className={`form-control signUpInput mt-2 ${errors?.address_two ? 'inputError' : ''}`}
                                {...register('address_two')}
                                type="text"
                                disabled={profileUpdateStatus === 'notUpdating'}
                            />
                            {
                                errors?.address_two
                                &&
                                (<span className='errorMessage'>{errors?.address_two?.message}</span>)
                            }
                        </div>
                    </>
                    :
                    <div className="mt-2 profileFormInputItem cityContainerProfileForm">
                        <label htmlFor="dashboardFullAddress">{t('DashboardProileSettingsPage.fullAddressFormInput')}</label>
                        <input
                            id='dashboardFullAddress'
                            className={`form-control signUpInput mt-2 ${errors?.full_address ? 'inputError' : ''}`}
                            {...register('full_address')}
                            type="text"
                            disabled={profileUpdateStatus === 'notUpdating'}
                        />
                        {
                            errors?.full_address
                            &&
                            (<span className='errorMessage'>{errors?.full_address?.message}</span>)
                        }
                    </div>
            }
            <div className={`bottomContainer pt-5 
                text-center m-auto
            `}>
                {
                    (profileUpdateStatus === 'notUpdating') ?
                        <span className='startUpdateBtn' onClick={() => {
                            scrollToTop();
                            localStorage.setItem('updatingProfile', 'updating');
                            setProfileUpdateStatus(localStorage.getItem('updatingProfile'));
                        }}>{t('DashboardProileSettingsPage.editBtnFormInput')}</span>
                        :
                        <input type="submit" disabled={isSubmitting} value={t('DashboardProileSettingsPage.confirmBtnFormInput')} className='updateBtn mt-0' />
                }
            </div>
        </form>
    )
}
