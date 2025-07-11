import React, { useEffect, useState } from 'react';
import './signUpFormMain.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../../validation/RegisterSchema';
import { NavLink, useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import { AddEmployeeSchema } from '../../validation/AddEmployee';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import Cookies from 'js-cookie';
import CustomDropdown from '../customeDropdownSelectSec/CustomeDropdownSelect';
import { GetAllCitizenshipsStore } from '../../store/AllCitizenships';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function PersonalSignUpFormMainSec({ token, countries, industries, isSignUp }) {
  const { t } = useTranslation();
  const [unAuth, setUnAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [defaultValue, setDefaultValue] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const navigate = useNavigate();
  const loginType = localStorage.getItem('loginType');
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      phone_code: '',
      password: '',
      country_id: '',
      city_id: '',
      image: '',

      password_confirmation: '',
      industry_id: '',
      address_one: '',
      address_two: '',

      citizenship_id: '',
      // citizenship: '',
      full_address: '',
      title: '',
      official_id_or_passport: '',
      role_id: '',
      accept_terms: '',
    },
    resolver: zodResolver(isSignUp ? RegisterSchema : AddEmployeeSchema),
  });
  const [currentCitiesInsideCountry, setCurrentCitiesInsideCountry] = useState([]);
  const citizenships = GetAllCitizenshipsStore((state) => state.citizenships);

  useEffect(() => {
    setCurrentCitiesInsideCountry([]);
    let currentCountryId = watch('country_id');
    const currentCountry = countries?.find(country => country?.id === +currentCountryId);
    if (currentCountry) {
      const toastId = toast.loading('Loading Cities , Please Wait !');
      const citiesInsideCurrentCountry = async () => {
        const response = await axios.get(`${baseURL}/countries/${currentCountry?.code}?t=${new Date().getTime()}`, {
                    headers: {
                        "Locale" : Lang
                    }
                });
        setCurrentCitiesInsideCountry(response?.data?.data?.cities);
      };
      citiesInsideCurrentCountry();
      if (currentCitiesInsideCountry) {
        toast.success('Cities Loaded Successfully.', {
          id: toastId,
          duration: 2000
        });
      } else {
        toast.error('Somthing Went Wrong Please Choose Your Country Again!', {
          id: toastId,
          duration: 2000
        });
        currentCountryId = ''
      }
    };
  }, [watch('country_id')]);

  useEffect(() => {
    if (watch('accept_terms') === true) {
      setValue('accept_terms', 'yes');
    } else if (watch('accept_terms') === false) {
      setValue('accept_terms', 'no');
    };
  }, [watch('accept_terms')]);

  useEffect(() => {
    if (!isSignUp && loginType === 'employee') {
      (async () => {
        await axios.get(`${baseURL}/${loginType}/roles?t=${new Date().getTime()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            "Locale": Lang
          }
        })
          .then(response => {
            setRoles(response?.data?.data?.roles);
          })
          .catch(error => {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
              setUnAuth(true);
            };
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
          })
      })();
    };
  }, []);

  // useEffect(()=>{
  //   if(!isSignUp && loginType === 'employee'){
  //     return citizenships;
  //   }
  // },[citizenships])

  //   const handleImageChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //         if (file.size > 5 * 1024 * 1024) { // Limit size to 5MB
  //             toast.error('File size should not exceed 5MB');
  //             return;
  //         }
  //         if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
  //             toast.error('Unsupported file format. Please upload JPEG, PNG, or PDF.');
  //             return;
  //         }
  //         setImagePreview(URL.createObjectURL(file));
  //     }
  // };

  // const handlePassportChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //       if (file.size > 5 * 1024 * 1024) { // Limit size to 5MB
  //           toast.error('File size should not exceed 5MB');
  //           return;
  //       }
  //       if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
  //           toast.error('Unsupported file format. Please upload JPEG, PNG, or PDF.');
  //           return;
  //       }
  //       if (file.type.startsWith('image/')) {
  //           setPassPortPreview(URL.createObjectURL(file));
  //           setFileName('');
  //       } else {
  //           setPassPortPreview(null);
  //           setFileName(file.name);
  //       }
  //   } else {
  //       setPassPortPreview(null);
  //       setFileName('');
  //   }
  // };

  const onSubmit = async (data) => {
    data.industry_id = selectedIndustries?.map(indust => indust?.id);
    const toastId = toast.loading('Please Wait...');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key]) && key !== 'image') {
        data[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (key !== 'image') {
        formData.append(key, data[key]);
      };
    });
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.official_id_or_passport) {
      formData.append('official_id_or_passport', data.official_id_or_passport);
    }
    const currentSlug = isSignUp ? 'user/register' : 'employee/add-employee';
    const currentHeaders = isSignUp ? {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    } : {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    };
    await axios.post(`${baseURL}/${currentSlug}?t=${new Date().getTime()}`, formData, {
      headers: currentHeaders,
    }).then(response => {
      const token = response?.data?.data?.token;
      const userData = response?.data?.data?.user;
      if (token) {
        Cookies.set('authToken', token, { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 });
        Cookies.set('currentLoginedData', JSON.stringify(response?.data?.data?.user), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
        if (isSignUp) {
          Cookies.set('verified', userData?.verified, { expires: 365 });
        }
        toast.success(`${response?.data?.message}` || 'Created Successfully!', {
          id: toastId,
          duration: 2000
        });
        isSignUp &&
          (!userData?.verified) &&
          (setTimeout(() => {
            navigate('/user-verification');
          }, 1000));
        isSignUp &&
          (userData?.verified) &&
          (setTimeout(() => {
            navigate('/profile/profile-settings');
          }, 1000));
        scrollToTop();
        reset();
      }
    })
      .catch(error => {
        if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        };
        Object.keys(error?.response?.data?.errors).forEach((key) => {
          setError(key, { message: error?.response?.data?.errors[key][0] });
        });
        window.scrollTo({ top: 550 });
        toast.error(error?.response?.data?.message, {
          id: toastId,
          duration: 2000
        });
      });
  };



  

  const [imagePreview, setImagePreview] = useState(null);
  const [passportPreview, setPassPortPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    };
  };

  const handlePassportChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('official_id_or_passport', file);
      if (file.type.startsWith('image/')) {
        setPassPortPreview(URL.createObjectURL(file));
        setFileName('');
      } else {
        setPassPortPreview(null);
        setFileName(file.name);
      }
    } else {
      setPassPortPreview(null);
      setFileName('');
    };
  };

  const handleSelectIndust = (el) => {
    const currIndust = industries?.find(indust => +indust?.id === +el);
    const condition = selectedIndustries?.find(indust => +indust?.id === currIndust?.id);
    if (!condition) {
      setSelectedIndustries([...selectedIndustries, currIndust]);
    };
    setDefaultValue('');
  };

  const handleDeleteSelectedIndust = (el) => {
    const currIndust = industries?.find(indust => +indust?.id === +el?.id);
    setSelectedIndustries(selectedIndustries?.filter(indust => +indust?.id !== +currIndust?.id));
  };

  useEffect(() => {
    if (watch('password') !== watch('password_confirmation')) {
      setError('password_confirmation', { message: 'Passwords do not match' });
    } else if (watch('password_confirmation') === watch('password')) {
      clearErrors("password_confirmation");
    };
  }, [watch('password_confirmation')]);


  console.log(watch('image'));
  console.log(watch('official_id_or_passport'));

  console.log(citizenships);

  return (
    <>
      {
        unAuth ?
          <UnAuthSec />
          :
          <div className='signUpForm__mainSec py-5 mb-5'>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {
                    isSignUp &&
                    <ul className='row loginToggler'>
                      <li className={`col-md-3 cursorPointer active`} onClick={() => navigate('/personalsignUp')}>
                        {t('PersonalSignUpPage.userTitFilterItem')}
                      </li>
                      <li className={`col-md-3 cursorPointer`} onClick={() => navigate('/business-signUp')}>
                        {t('PersonalSignUpPage.businessTitFilterItem')}
                      </li>
                    </ul>
                  }
                  <div className="signUpForm__mainContent">
                    <div className="row">
                      <h3 className="col-12 text-center py-5 signUpForm__head">
                        {isSignUp ? 'Personal Information' : 'Employee Information'}
                      </h3>
                      <form onSubmit={handleSubmit(onSubmit)} className='row'>
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpFullName">
                            {t('PersonalSignUpPage.fullNameFormInput')} <span className="requiredStar">*</span>
                          </label>
                          <input
                            type='text'
                            id='signUpFullName'
                            placeholder={t('PersonalSignUpPage.fullNameFormInput')}
                            {...register('name')}
                            className={`form-control signUpInput ${errors.name ? 'inputError' : ''}`}
                          />
                          {
                            errors.name
                            &&
                            (<span className='errorMessage'>{errors.name.message}</span>)
                          }
                        </div>
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpEmailAddress">
                            {t('PersonalSignUpPage.emailAddressFormInput')} <span className="requiredStar">*</span>
                          </label>
                          <input
                            type='text'
                            id='signUpEmailAddress'
                            placeholder={t('PersonalSignUpPage.emailAddressFormInputPlaceholder')}
                            {...register('email')}
                            className={`form-control signUpInput ${errors.email ? 'inputError' : ''}`}
                          />
                          {
                            errors.email
                            &&
                            (<span className='errorMessage'>{errors.email.message}</span>)
                          }
                        </div>
                        {
                          !isSignUp &&
                          <>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="addEmployeetitle">
                                {t('PersonalSignUpPage.employeeTitleFormInput')} <span className="requiredStar">*</span>
                              </label>
                              <div className="position-relative">
                                <input
                                  type={`text`}
                                  id='addEmployeetitle'
                                  placeholder={t('PersonalSignUpPage.employeeTitleFormInput')}
                                  {...register('title')}
                                  className={`form-control signUpInput ${errors.title ? 'inputError' : ''}`}
                                />
                              </div>
                              {
                                errors.title
                                &&
                                (<span className='errorMessage'>{errors.title.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpMobileNumber">
                            {t('PersonalSignUpPage.mobileNumberFormInput')} <span className="requiredStar">*</span>
                          </label>
                          <div className="row">
                            <div className="col-md-5 col-sm-12">
                            <CustomDropdown
                              optionsData={countries}
                              setValue={setValue}
                              value={watch("phone_code")}
                              errors={errors}
                              inputName="phone_code"
                              placeholder={t('PersonalSignUpPage.countryFormInputPlaceholder')} 
                              isFlagDropdown={true}
                            />
                            </div>
                            <div className="col-md-7 col-sm-12">
                              <input
                                type='text'
                                id='signUpMobileNumber'
                                placeholder={t('PersonalSignUpPage.mobileFormInputPlaceholder')} 
                                {...register('phone')}
                                className={`form-control signUpInput ${errors.phone ? 'inputError' : ''}`}
                              />
                              {
                                errors.phone
                                &&
                                (<span className='errorMessage'>{errors.phone.message}</span>)
                              }
                            </div>
                          </div>
                        </div>
                          </>
                        }
                       { isSignUp &&
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpMobileNumber">
                            {t('PersonalSignUpPage.mobileNumberFormInput')} <span className="requiredStar">*</span>
                          </label>
                          <div className="row">
                            <div className="col-md-5 col-sm-12">
                            <CustomDropdown
                              optionsData={countries}
                              setValue={setValue}
                              value={watch("phone_code")}
                              errors={errors}
                              inputName="phone_code"
                              placeholder={t('PersonalSignUpPage.countryFormInputPlaceholder')}
                              isFlagDropdown={true}
                            />
                            </div>
                            <div className="col-md-7 col-sm-12">
                              <input
                                type='text'
                                id='signUpMobileNumber'
                                placeholder={t('PersonalSignUpPage.mobileFormInputPlaceholder')}
                                {...register('phone')}
                                className={`form-control signUpInput ${errors.phone ? 'inputError' : ''}`}
                              />
                              {
                                errors.phone
                                &&
                                (<span className='errorMessage'>{errors.phone.message}</span>)
                              }
                            </div>
                          </div>
                        </div>
                        }
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpCountry">
                            {t('PersonalSignUpPage.countryRegionFormInput')} <span className="requiredStar">*</span>
                          </label>
                          <div className="position-relative">
                            <select
                              id="signUpCountry"
                              className={`form-select signUpInput ${errors.country_id ? 'inputError' : ''} ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                              {...register('country_id')} >
                              <option value="" disabled>
                                {t('PersonalSignUpPage.countryFormInputPlaceholder')}
                              </option>
                              {countries?.map((country) => (
                                <option key={country.id} value={country.id}>
                                  {country.name}
                                </option>
                              ))}
                            </select>

                          </div>
                          {
                            errors.country_id
                            &&
                            (<span className='errorMessage'>{errors.country_id.message}</span>)
                          }
                        </div>
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpCity">
                            {t('PersonalSignUpPage.cityFormInput')} <span className="requiredStar">*</span>
                          </label>
                          <select
                            id="signUpCity"
                            className={`form-select signUpInput ${errors.city_id ? 'inputError' : ''} ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                            {...register('city_id')} >
                            <option value="" disabled>
                             {t('PersonalSignUpPage.cityFormInputPlaceholder')}
                            </option>
                            {currentCitiesInsideCountry?.map((city) => (
                              <option key={city.cityId} value={city.cityId}>
                                {city.cityName}
                              </option>
                            ))}
                          </select>
                          {
                            errors.city_id &&
                            <span className="errorMessage">{errors.city_id.message}</span>
                          }
                        </div>
                        {!isSignUp &&
                          <>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="addEmployeerole_id">
                                {t('PersonalSignUpPage.employeeRoleFormInput')} <span className="requiredStar">*</span>
                              </label>
                              <div className="position-relative">
                                <select
                                  id='addEmployeerole_id'
                                  {...register('role_id')}
                                  className={`form-select signUpInput ${errors.role_id ? 'inputError' : ''} ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                >
                                  <option value="" disabled>{t('PersonalSignUpPage.employeeRoleFormInputPlaceholder')}</option>
                                  {roles?.map(el => (
                                    <option key={el?.id} value={el?.id}>{el?.name}</option>
                                  ))}
                                </select>
                              </div>
                              {
                                errors.role_id
                                &&
                                (<span className='errorMessage'>{errors.role_id.message}</span>)
                              }
                            </div>
                            {/* <div className="col-lg-6 mb-4">
                              <label htmlFor="addEmployeecitizenship">
                                Citizenship <span className="requiredStar">*</span>
                              </label>
                              <div className="position-relative">
                                <input
                                  type={`text`}
                                  id='addEmployeecitizenship'
                                  placeholder='Enter Your Citizenship'
                                  {...register('citizenship')}
                                  className={`form-control signUpInput ${errors.citizenship ? 'inputError' : ''}`}
                                />
                              </div>
                              {
                                errors.citizenship
                                &&
                                (<span className='errorMessage'>{errors.citizenship.message}</span>)
                              }
                            </div> */}
                             <div className="col-lg-6 mb-4">
                              <label htmlFor="addEmployeecitizenship">
                                {t('PersonalSignUpPage.citizenshipFormInput')} <span className="requiredStar"> *</span>
                                <i title="egyptian" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                id='addEmployeecitizenship'
                                defaultValue={''}
                                {...register('citizenship_id')}
                                className={`form-select signUpInput ${errors.citizenship_id ? 'inputError' : ''} ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                              >
                                <option value='' disabled>{t('PersonalSignUpPage.citizenshipFormInputPlaceholder')}</option>
                                {
                                  citizenships?.map(el => (
                                    <option key={el?.id} value={el?.id}>
                                      {el?.name}
                                    </option>
                                  ))
                                }
                              </select>
                              {
                                errors.citizenship_id
                                &&
                                (<span className='errorMessage'>{errors.citizenship_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="addEmployeefull_address">
                                {t('PersonalSignUpPage.fullAddressFormInput')} <span className="requiredStar">*</span>
                              </label>
                              <div className="position-relative">
                                <input
                                  type={`text`}
                                  id='addEmployeefull_address'
                                  placeholder='Enter Full Address'
                                  {...register('full_address')}
                                  className={`form-control signUpInput ${errors.full_address ? 'inputError' : ''}`}
                                />
                              </div>
                              {
                                errors.full_address
                                &&
                                (<span className='errorMessage'>{errors.full_address.message}</span>)
                              }
                            </div>

                          </>
                        }
                        {
                          isSignUp &&
                          <>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpaddress_one">
                                {t('PersonalSignUpPage.addressLine1FormInput')}   <span className="requiredStar">*</span>
                              </label>
                              <input
                                type='text'
                                id='signUpaddress_one'
                                placeholder={t('PersonalSignUpPage.addressLine1FormInputPlaceholder')}
                                {...register('address_one')}
                                className={`form-control signUpInput ${errors.address_one ? 'inputError' : ''}`}
                              />
                              {
                                errors.address_one
                                &&
                                (<span className='errorMessage'>{errors.address_one.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpaddress_two">
                                {t('PersonalSignUpPage.addressLine2FormInput')}  <span className="optional">( {t('PersonalSignUpPage.optionalText')} )</span>
                              </label>
                              <input
                                type='text'
                                id='signUpaddress_two'
                                placeholder={t('PersonalSignUpPage.addressLine2FormInputPlaceholder')}
                                {...register('address_two')}
                                className={`form-control signUpInput ${errors.address_two ? 'inputError' : ''}`}
                              />
                              {
                                errors.address_two
                                &&
                                (<span className='errorMessage'>{errors.address_two.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpindustry">
                                {t('PersonalSignUpPage.industryFormInput')} <span className="requiredStar">*</span>
                              </label>
                              <select
                                id="signUpindustry"
                                defaultValue={defaultValue}
                                className={`form-select signUpInput ${errors.industry_id ? 'inputError' : ''} ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                onChange={(el) => handleSelectIndust(el.target.value)}
                              >
                                <option value="" disabled>
                                  {t('PersonalSignUpPage.industryFormInputPlaceholder')}
                                </option>
                                {industries?.map((industry) => (
                                  <option key={industry.id} value={industry.id}>
                                    {industry.name}
                                  </option>
                                ))}
                              </select>
                              <div>
                                {selectedIndustries?.map((indust) => (
                                  <span className='chosen__choice' key={indust.id}>
                                    {indust.name}
                                    <i
                                      onClick={() => handleDeleteSelectedIndust(indust)}
                                      className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                  </span>
                                ))}
                              </div>
                              {
                                errors.industry_id &&
                                <span className="errorMessage">{errors.industry_id.message}</span>
                              }
                            </div>
                          </>
                        }
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpPassword">
                            {t('PersonalSignUpPage.passwordFormInput')} <span className="requiredStar">*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type={`${showPassword ? 'text' : 'password'}`}
                              id='signUpPassword'
                              placeholder={t('PersonalSignUpPage.passwordFormInputPlaceholder')}
                              {...register('password')}
                              className={`form-control signUpInput ${errors.password ? 'inputError' : ''}`}
                            />
                            <div className={` ${Lang === 'ar' ? 'leftShowPasssord_RTL' : 'leftShowPasssord'}`} onClick={() => setShowPassword(!showPassword)}>
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
                        {
                          isSignUp &&
                          <div className="col-lg-6 mb-4">
                            <label htmlFor="signUpConfirmPassword">
                              {t('PersonalSignUpPage.ConfirmPasswordFormInput')} <span className="requiredStar">*</span>
                            </label>
                            <div className="position-relative">
                              <input
                                type={`${showConfirmPassword ? 'text' : 'password'}`}
                                id='signUpConfirmPassword'
                                placeholder={t('PersonalSignUpPage.ConfirmPasswordFormInput')}
                                {...register('password_confirmation')}
                                className={`form-control signUpInput ${errors.password_confirmation ? 'inputError' : ''}`}
                              />
                              <div className={` ${Lang === 'ar' ? 'leftShowPasssord_RTL' : 'leftShowPasssord'}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {
                                  showConfirmPassword ?
                                    <i className="bi bi-eye-slash"></i>
                                    :
                                    <i className="bi bi-eye-fill"></i>
                                }
                              </div>
                            </div>
                            {
                              errors.password_confirmation
                              &&
                              (<span className='errorMessage'>{errors.password_confirmation.message}</span>)
                            }
                          </div>
                        }
                        {
                          !isSignUp &&
                          // <div className='col-lg-12 mb-4'>
                          //   <label className='text-capitalize' htmlFor="addEmployeeofficial_id_or_passport" >
                          //     Official ID Or Passport<span className="requiredStar"> *</span>
                          //   </label>
                          //   <input
                          //     type='file'
                          //     id='addEmployeeofficial_id_or_passport'
                          //     {...register('official_id_or_passport')}
                          //     className={`form-control newUploadBtn ${errors.official_id_or_passport ? 'inputError' : ''}`}
                          //   />
                          //   {
                          //     errors.official_id_or_passport
                          //     &&
                          //     (<p className='errorMessage'>{errors.official_id_or_passport.message}</p>)
                          //   }
                          // </div>
                          <div className='col-lg-8'>
                          <label htmlFor="addEmployeeofficial_id_or_passport">
                            {t('PersonalSignUpPage.uploadIDFormInput')}
                            <span className="requiredStar"> *</span>
                          </label>
                          <input
                            type='file'
                            id='addEmployeeofficial_id_or_passport'
                            className={`newUploadBtn form-control ${errors.official_id_or_passport ? 'inputError' : ''}`}
                            onChange={handlePassportChange}
                          />
                          {
                            errors.official_id_or_passport
                            &&
                            (<p className='errorMessage'>{errors.official_id_or_passport.message}</p>)
                          }
                          {passportPreview ? (
                            <div className='image-preview'>
                              <img
                                src={passportPreview}
                                alt="Selected profile"
                                style={{ maxWidth: '100px', height: '100px', marginTop: '10px', borderRadius: '12px' }}
                              />
                            </div>
                          ) : (
                            fileName && (
                              <p className='file-name' style={{ marginTop: '10px', color: '#555' }}>
                                {fileName}
                              </p>
                            )
                          )}
                          </div>
                        }
                        <div className='col-lg-6'>
                          <label htmlFor="signUpProfileImage">
                            {t('PersonalSignUpPage.uploadProdileImgFormInput')}
                            <span className="requiredStar"> *</span>
                          </label>
                          <input
                            type='file'
                            id='signUpProfileImage'
                            className={`newUploadBtn form-control ${errors.image ? 'inputError' : ''}`}
                            onChange={handleImageChange}
                          />
                          {
                            errors.image
                            &&
                            (<p className='errorMessage'>{errors.image.message}</p>)
                          }
                          {imagePreview && (
                            <div className='image-preview'>
                              <img src={imagePreview} alt="Selected profile" style={{ maxWidth: '100px', height: '100px', marginTop: '10px', borderRadius: '12px' }} />
                            </div>
                          )}
                        </div>
                        {
                          isSignUp && 
                          <div className='col-lg-6'>
                          <label htmlFor="signUpProfileofficial_id_or_passport">
                            {t('PersonalSignUpPage.uploadIDFormInput')}
                            <span className="requiredStar"> *</span>
                          </label>
                          <input
                            type='file'
                            id='signUpProfileofficial_id_or_passport'
                            className={`newUploadBtn form-control ${errors.official_id_or_passport ? 'inputError' : ''}`}
                            onChange={handlePassportChange}
                          />
                          {
                            errors.official_id_or_passport
                            &&
                            (<p className='errorMessage'>{errors.official_id_or_passport.message}</p>)
                          }
                          {passportPreview ? (
                            <div className='image-preview'>
                              <img
                                src={passportPreview}
                                alt="Selected profile"
                                style={{ maxWidth: '100px', height: '100px', marginTop: '10px', borderRadius: '12px' }}
                              />
                            </div>
                          ) : (
                            fileName && (
                              <p className='file-name' style={{ marginTop: '10px', color: '#555' }}>
                                {fileName}
                              </p>
                            )
                          )}
                          </div>
                        }
                        
                        {
                          isSignUp &&
                          <div className="col-lg-8 my-4">
                            <label
                              htmlFor="singUpaccept_terms"
                              className='row justify-content-start align-items-start'>
                              <p className="signUpCostom-checkBox col-md-1 col-sm-2 mt-1">
                                <input
                                  type="checkbox"
                                  id="singUpaccept_terms"
                                  {...register('accept_terms')}
                                  className='signUpCheckBox'
                                />
                                <span className="checkmark"></span>
                              </p>
                              <p className="col-md-11 p-0 col-sm-10 checkBox-text">
                                 {t('PersonalSignUpPage.acceptTermFormInput')}
                              </p>
                            </label>
                            {errors.accept_terms && <p className='errorMessage'>{errors.accept_terms.message}</p>}
                          </div>
                        }
                        <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                          <input disabled={isSubmitting} type="submit" value={isSignUp ? `${t('PersonalSignUpPage.signUpBtn')}` : `${t('PersonalSignUpPage.addEmployeeBtn')}`} />
                        </div>
                      </form>
                      {
                        isSignUp &&
                        <div className="col-lg-12 signUpOtherWays text-center pe-4">
                          <div className="serviceTerms">
                            <p>
                              {t('PersonalSignUpPage.bycontinueBeforeBrText')}<br />  {t('PersonalSignUpPage.bycontinueAfterBrText')}
                            </p>
                          </div>
                          <div className="signInNavigation mb-5">
                            {t('PersonalSignUpPage.alreadyHaveAccBtn')}
                            <NavLink className='nav-link d-inline ms-1' to='/logIn' onClick={() => scrollToTop()}>{t('PersonalSignUpPage.signInBtn')}</NavLink>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  );
};
