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

export default function PersonalSignUpFormMainSec({ token, countries, industries, isSignUp }) {
  const [unAuth, setUnAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const loginType = localStorage.getItem('loginType');

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      country_id: '',
      city_id: '',
      image: '',

      password_confirmation: '',
      industry_id: '',
      address_one: '',
      address_two: '',

      citizenship: '',
      full_address: '',
      title: '',
      official_id_or_passport: '',
      role_id: ''
    },
    resolver: zodResolver(isSignUp ? RegisterSchema : AddEmployeeSchema),
  });

  const [currentCitiesInsideCountry, setCurrentCitiesInsideCountry] = useState([]);
  useEffect(() => {
    setCurrentCitiesInsideCountry([]);
    let currentCountryId = watch('country_id');
    const currentCountry = countries?.find(country => country?.id === +currentCountryId);
    if (currentCountry) {
      const toastId = toast.loading('Loading Cities , Please Wait !');
      const citiesInsideCurrentCountry = async () => {
        const response = await axios.get(`${baseURL}/countries/${currentCountry?.code}?t=${new Date().getTime()}`);
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
    if (!isSignUp && loginType === 'employee') {
      (async () => {
        await axios.get(`${baseURL}/${loginType}/roles?t=${new Date().getTime()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
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

  const onSubmit = async (data) => {
    const toastId = toast.loading('Please Wait...');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, data[key]);
      }
    });
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }
    if (data.official_id_or_passport && data.official_id_or_passport[0]) {
      formData.append('official_id_or_passport', data.official_id_or_passport[0]);
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
      if (token) {
        Cookies.set('authToken', token, { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 });

        Cookies.set('currentLoginedData', JSON.stringify(response?.data?.data?.user), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
        toast.success(`${response?.data?.message}` || 'Created Successfully!', {
          id: toastId,
          duration: 2000
        });
        isSignUp && 
          (!response?.data?.data?.user?.verified) &&
            (setTimeout(() => {
              navigate('/user-verification');
            }, 1000));
        isSignUp && 
          (response?.data?.data?.user?.verified) &&
            (setTimeout(() => {
              navigate('/');
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
  // image preview
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
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
                  <ul className='row loginToggler'>
                    <li className={`col-md-3 cursorPointer active`} onClick={() => navigate('/personalsignUp')}>
                      User
                    </li>
                    <li className={`col-md-3 cursorPointer`} onClick={() => navigate('/business-signUp')}>
                      Business
                    </li>
                  </ul>
                  <div className="signUpForm__mainContent">
                    <div className="row">
                      <h3 className="col-12 text-center py-5 signUpForm__head">
                        Personal Information
                      </h3>
                      <form onSubmit={handleSubmit(onSubmit)} className='row'>
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpFullName">
                            Full Name <span className="requiredStar">*</span>
                          </label>
                          <input
                            type='text'
                            id='signUpFullName'
                            placeholder='Full Name'
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
                            E-mail Address <span className="requiredStar">*</span>
                          </label>
                          <input
                            type='text'
                            id='signUpEmailAddress'
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
                        {
                          !isSignUp &&
                          <>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="addEmployeetitle">
                                Employee Title <span className="requiredStar">*</span>
                              </label>
                              <div className="position-relative">
                                <input
                                  type={`text`}
                                  id='addEmployeetitle'
                                  placeholder='Enter Employee Title'
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
                          </>
                        }
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpMobileNumber">
                            Mobile Number <span className="requiredStar">*</span>
                          </label>
                          <div className="row">
                            <div className="col-12">
                              <input
                                type='text'
                                id='signUpMobileNumber'
                                placeholder='Enter your phone number'
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
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpCountry">
                            Country / Region <span className="requiredStar">*</span>
                          </label>
                          <div className="position-relative">
                            <select
                              id="signUpCountry"
                              className={`form-select signUpInput ${errors.country_id ? 'inputError' : ''}`}
                              {...register('country_id')} >
                              <option value="" disabled>
                                Select a Country
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
                            City <span className="requiredStar">*</span>
                          </label>
                          <select
                            id="signUpCity"
                            className={`form-select signUpInput ${errors.city_id ? 'inputError' : ''}`}
                            {...register('city_id')} >
                            <option value="" disabled>
                              Select a City
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
                                Employee Role <span className="requiredStar">*</span>
                              </label>
                              <div className="position-relative">
                                <select
                                  id='addEmployeerole_id'
                                  {...register('role_id')}
                                  className={`form-select signUpInput ${errors.role_id ? 'inputError' : ''}`}
                                >
                                  <option value="" disabled>Select Role</option>
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
                            <div className="col-lg-6 mb-4">
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
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="addEmployeefull_address">
                                Full Address <span className="requiredStar">*</span>
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
                                Address Line 1  <span className="requiredStar">*</span>
                              </label>
                              <input
                                type='text'
                                id='signUpaddress_one'
                                placeholder='Street name, City , Zip Code'
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
                                Address Line 2  <span className="optional">( Optional )</span>
                              </label>
                              <input
                                type='text'
                                id='signUpaddress_two'
                                placeholder='Building no. , apt no. , etc'
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
                                Industry <span className="requiredStar">*</span>
                              </label>
                              <select
                                id="signUpindustry"
                                className={`form-select signUpInput ${errors.industry_id ? 'inputError' : ''}`}
                                {...register('industry_id')} >
                                <option value="" disabled>
                                  Select an industry
                                </option>
                                {industries?.map((industry) => (
                                  <option key={industry.id} value={industry.id}>
                                    {industry.name}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.industry_id &&
                                <span className="errorMessage">{errors.industry_id.message}</span>
                              }
                            </div>
                          </>
                        }
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="signUpPassword">
                            Password <span className="requiredStar">*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type={`${showPassword ? 'text' : 'password'}`}
                              id='signUpPassword'
                              placeholder='Enter 8-digit password'
                              {...register('password')}
                              className={`form-control signUpInput ${errors.password ? 'inputError' : ''}`}
                            />
                            <div className="leftShowPasssord" onClick={() => setShowPassword(!showPassword)}>
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
                              Confirm Password <span className="requiredStar">*</span>
                            </label>
                            <div className="position-relative">
                              <input
                                type={`${showConfirmPassword ? 'text' : 'password'}`}
                                id='signUpConfirmPassword'
                                placeholder='Enter 8-digit password'
                                {...register('password_confirmation')}
                                className={`form-control signUpInput ${errors.password_confirmation ? 'inputError' : ''}`}
                              />
                              <div className="leftShowPasssord" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
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
                          <div className='col-lg-12 mb-4'>
                            <label htmlFor="addEmployeeofficial_id_or_passport" >
                              Official Id Or Passport<span className="requiredStar"> *</span>
                            </label>
                            <input
                              type='file'
                              id='addEmployeeofficial_id_or_passport'
                              {...register('official_id_or_passport')}
                              className={`form-control newUploadBtn ${errors.official_id_or_passport ? 'inputError' : ''}`}
                            />
                            {
                              errors.official_id_or_passport
                              &&
                              (<p className='errorMessage'>{errors.official_id_or_passport.message}</p>)
                            }
                          </div>
                        }
                        <div className='col-lg-12'>
                          <label htmlFor="signUpProfileImage">
                            Upload Profile Image
                            <span className="requiredStar"> *</span>
                          </label>
                          <input
                            type='file'
                            id='signUpProfileImage'
                            {...register('image')}
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
                                <img src={imagePreview} alt="Selected profile" style={{ maxWidth: '100px', height: '100px', marginTop: '10px', borderRadius:'12px' }} />
                              </div>
                            )}
                        </div>
                        <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                          <input disabled={isSubmitting} type="submit" value={isSignUp ? 'Sign Up' : 'Add Employee'} />
                        </div>
                      </form>
                      {
                        isSignUp &&
                        <div className="col-lg-12 signUpOtherWays text-center pe-4">
                          <div className="serviceTerms">
                            <p>
                              By continuing, you agree to ReachMagnet's<br />  Terms of Service and acknowledge that you've read our Privacy Policy.
                            </p>
                          </div>
                          <div className="signInNavigation mb-5">
                            Already have an account?
                            <NavLink className='nav-link d-inline ms-1' to='/logIn' onClick={() => scrollToTop()}>Sign In</NavLink>
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
