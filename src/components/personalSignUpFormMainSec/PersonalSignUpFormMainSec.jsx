import React, { useState } from 'react';
import './signUpFormMain.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../../validation/RegisterSchema';
import { NavLink, useNavigate } from 'react-router-dom';
import flagImg from '../../assets/productDetailsImgs/17e9aaa6c0d56bd5d83aa9c3524baa7b.png';
import { scrollToTop } from '../../functions/scrollToTop';

export default function PersonalSignUpFormMainSec() {
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
    defaultValues:{
      firstName: '',
      lastName: '',
      country: '',
      userName: '',
      mobileNumber: '',
      email: '',
      password: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      confirmPassword: '',
    },
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data) => {
    await new Promise((resolve)=> setTimeout(resolve,1000));
    console.log(data);
    reset();
  };

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  return (
    <div className='signUpForm__mainSec py-5 mb-5'>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="signUpForm__mainContent">
              <div className="row">
                <h3 className="col-12 text-center py-5 signUpForm__head">
                  Personal Information
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className='row'>
                  <div className="col-lg-6 mb-4">
                      <label htmlFor="signUpFirstName">
                        Full Name
                      </label>
                      <div className="row gap-sm-3 signUpFullNameContent">
                        <div className="col-md-6">
                          <input 
                            type='text'
                            id='signUpFirstName'
                            placeholder='First Name'
                            {...register('firstName')}
                            className={`form-control signUpInput ${errors.firstName ? 'inputError' : ''}`}
                          />
                          {
                            errors.firstName 
                            &&
                            (<span className='errorMessage'>{errors.firstName.message}</span>)
                          }
                        </div>
                        <div className="col-md-6">
                          <input 
                            type='text'
                            id='signUpLastName'
                            placeholder='Last Name'
                            {...register('lastName')}
                            className={`form-control signUpInput ${errors.lastName ? 'inputError' : ''}`}
                          />
                          {
                            errors.lastName 
                            &&
                            (<span className='errorMessage'>{errors.lastName.message }</span>)
                          }
                        </div>
                      </div>
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpCountry">
                      Country / Region
                    </label>
                    <div className="position-relative">
                      <select
                      id="signUpCountry" 
                      className={`form-select signUpInput signUpCountry ${errors.country ? 'inputError' : ''}`}
                      {...register('country')} >
                        <option value="" disabled>
                          Select a Country
                        </option>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="leftCountryFlag">
                        <img src={flagImg} alt='Current Country Flag' />
                      </div>
                    </div>
                    {
                      errors.country 
                      &&
                      (<span className='errorMessage'>{errors.country.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpUserName">
                      User Name
                    </label>
                    <input 
                      type='text'
                      id='signUpUserName'
                      placeholder='ex: @fullname'
                      {...register('userName')}
                      className={`form-control signUpInput ${errors.userName ? 'inputError' : ''}`}
                    />
                    {
                      errors.userName 
                      &&
                      (<span className='errorMessage'>{errors.userName.message}</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpMobileNumber">
                      Mobile Number
                    </label>
                    <div className="row">
                      <div className="col-3">
                        <input 
                          type='text'
                          value={`+962`}
                          className={`form-control signUpInput`}
                          disabled
                        />
                      </div>
                      <div className="col-9">
                        <input 
                          type='text'
                          id='signUpMobileNumber'
                          placeholder='Enter your phone number'
                          {...register('mobileNumber')}
                          className={`form-control signUpInput ${errors.mobileNumber ? 'inputError' : ''}`}
                        />
                        {
                          errors.mobileNumber 
                          &&
                          (<span className='errorMessage'>{errors.mobileNumber.message}</span>)
                        }
                      </div>
                    </div>

                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpPassword">
                      Password
                    </label>
                    <div className="position-relative">
                      <input 
                        type={`${showPassword ? 'text' : 'password'}`}
                        id='signUpPassword'
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
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpEmailAddress">
                      E-mail Address
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
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpConfirmPassword">
                    Confirm Password
                    </label>
                    <div className="position-relative">
                      <input 
                        type={`${showConfirmPassword ? 'text' : 'password'}`}
                        id='signUpConfirmPassword'
                        placeholder='Enter 8-digit password'
                        {...register('confirmPassword')}
                        className={`form-control signUpInput ${errors.confirmPassword ? 'inputError' : ''}`}
                      />
                      <div className="leftShowPasssord" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                        {
                          showConfirmPassword ?
                          <i className="bi bi-eye-slash"></i>
                          :
                          <i className="bi bi-eye-fill"></i>
                        }
                      </div>
                    </div>
                    {
                      errors.confirmPassword
                      &&
                      (<span className='errorMessage'>{errors.confirmPassword.message}</span>)
                    }
                  </div>
                  <div className="col-lg-12 my-5">
                    <h3 className='signUpForm__head mt-5 text-center'>
                      Residential Information
                    </h3>
                  </div>
                  <div className="col-lg-6">
                    <div className='row'>
                      <div className="col-lg-12 mb-4">
                        <label htmlFor="signUpAddress1">
                          Address Line 1 <span className='requiredStar'>*</span>
                        </label>
                        <input 
                          type="text" 
                          id='signUpAddress1' 
                          placeholder='Street name, City , Zip Code'
                          {...register('addressLine1')}
                          className={`form-control signUpInput ${errors.addressLine1 ? 'inputError' : ''}`}
                        />
                        {
                          errors.addressLine1 &&
                          <span className="errorMessage">{errors.addressLine1.message}</span>
                        }
                      </div>
                      <div className="col-lg-12 mb-4">
                        <label htmlFor="signUpAddress2">
                          Address Line 2 <span className='optional'>(Optional)</span>
                        </label>
                        <input 
                          type="text" 
                          id='signUpAddress2'
                          placeholder='Building no. , apt no. , etc'
                          {...register('addressLine2')}
                          className={`form-control signUpInput ${errors.addressLine2 ? 'inputError' : ''}`}
                        />
                        {
                          errors.addressLine2 &&
                          <span className="errorMessage">{errors.addressLine2.message}</span>
                        }
                      </div>
                      <div className="col-lg-12 mb-4">
                        <label htmlFor="signUpCity">
                          City <span className="requiredStar">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="signUpCity" 
                          placeholder='City'
                          {...register('city',{required: 'Required'})}
                          className={`form-control signUpInput ${errors.city ? 'inputError' : ''}`}
                        />
                        {
                          errors.city && 
                          <span className="errorMessage">{errors.city.message}</span>
                        }
                      </div>
                      <div className="signUpAddressBtn col-lg-12 text-center">
                        <span>Save and continue</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                    <input disabled={isSubmitting} type="submit" value={'Sign Up'} />
                  </div>
                </form>
                <div className="col-lg-12 signUpOtherWays text-center pe-4">
                  <div className="serviceTerms">
                    <p>
                      By continuing, you agree to ReachMagnet's<br />  Terms of Service and acknowledge that you've read our Privacy Policy. 
                    </p>
                    <p className="businessQuestion">
                      Are you a business? 
                      <br />
                      <span className="getStarted" onClick={()=>{
                        navigate('/business-signup');
                        scrollToTop();
                      }}>
                        Get started here!
                      </span>
                    </p>
                  </div>
                  <div className="signInNavigation mb-5">
                    Already have an account?
                    <NavLink className='nav-link d-inline ms-1' to='/signIn' onClick={()=>scrollToTop()}>Sign In</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
