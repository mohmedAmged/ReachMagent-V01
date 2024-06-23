import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusinessRegisterSchema } from '../../validation/BusinessRegisterSchema';
import flagImg from '../../assets/productDetailsImgs/17e9aaa6c0d56bd5d83aa9c3524baa7b.png';
import BusinessSignUpPackages from '../businessSignUpPackages/BusinessSignUpPackages';

export default function BusinessSignUpFormMainSec() {
  const [showPassword,setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState:{errors , isSubmitting}
  } = useForm({
    defaultValues:{
      businessName: '',
      businessNumber: '',
      businessIndustry: '',
      businessCategory: '',
      businessSubCategory: '',
      businessCountry: '',
      businessFirstName: '',
      businessLastName: '',
      businessContactTitle: '',
      other: '',
      country: '',
      userName: '',
      mobileNumber: '',
      email: '',
      password: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      confirmPassword: '',
      citizenship: '',
      citizenshipFile: '',
      confirmCheckBox: false,
    },
    resolver: zodResolver(BusinessRegisterSchema),
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
                  Business Information
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className='row'>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpbusinessName">
                      Business official Name
                    </label>
                    <input 
                      type='text'
                      id='businessName'
                      placeholder='Company’s Name'
                      {...register('businessName')}
                      className={`form-control signUpInput ${errors.businessName ? 'inputError' : ''}`}
                    />
                    {
                      errors.businessName 
                      &&
                      (<span className='errorMessage'>{errors.businessName.message}</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusinessNumber">
                      Business Registration Number
                    </label>
                    <input 
                      type='text'
                      id='signUpBusinessNumber'
                      placeholder="Company's Number"
                      {...register('businessNumber')}
                      className={`form-control signUpInput ${errors.businessNumber ? 'inputError' : ''}`}
                    />
                    {
                      errors.businessNumber 
                      &&
                      (<span className='errorMessage'>{errors.businessNumber.message}</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusnissIndustry">
                      Main Industry
                    </label>
                    <select
                    id="signUpBusnissIndustry" 
                    className={`form-select signUpInput ${errors.businessIndustry ? 'inputError' : ''}`}
                    {...register('businessIndustry')} >
                      <option value="" disabled>
                        Company’s Industry
                      </option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {
                      errors.businessIndustry 
                      &&
                      (<span className='errorMessage'>{errors.businessIndustry.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusinessOther">
                      Other
                    </label>
                    <input 
                      type='text'
                      id='signUpBusinessOther'
                      placeholder="If none of the options , write down your company’s Industry"
                      {...register('other')}
                      className={`form-control signUpInput ${errors.other ? 'inputError' : ''}`}
                    />
                    {
                      errors.other 
                      &&
                      (<span className='errorMessage'>{errors.other.message}</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusnissCategory">
                      Main Category
                    </label>
                    <select
                    id="signUpBusnissCategory" 
                    className={`form-select signUpInput ${errors.businessCategory ? 'inputError' : ''}`}
                    {...register('businessCategory')} >
                      <option value="" disabled>
                        Company’s Main Category
                      </option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {
                      errors.businessCategory 
                      &&
                      (<span className='errorMessage'>{errors.businessCategory.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusnissSubCategory">
                      Sub Category
                    </label>
                    <select
                    id="signUpBusnissSubCategory" 
                    className={`form-select signUpInput ${errors.businessSubCategory ? 'inputError' : ''}`}
                    {...register('businessSubCategory')} >
                      <option value="" disabled>
                        Company’s Sub Category
                      </option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {
                      errors.businessSubCategory 
                      &&
                      (<span className='errorMessage'>{errors.businessSubCategory.message }</span>)
                    }
                  </div>

                  <div className="signUpForm__head col-12 mt-5 mb-3 pt-4">
                    <h4>
                      Business Registered Address
                    </h4>
                  </div>
                  <div className="col-lg-6 mb-4">
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
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusnissCountry">
                      Country / Region
                    </label>
                    <div className="position-relative">
                      <select
                      id="signUpBusnissCountry" 
                      className={`form-select signUpInput signUpCountry ${errors.businessCountry ? 'inputError' : ''}`}
                      {...register('businessCountry')} >
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
                      errors.businessCountry 
                      &&
                      (<span className='errorMessage'>{errors.businessCountry.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
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
                  <div className="col-lg-6 mb-4">
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

                  <div className="col-lg-12 my-5">
                    <h3 className='signUpForm__head mt-5 text-center'>
                      Contact Information
                    </h3>
                  </div>
                  <div className="col-lg-6 mb-4">
                      <label htmlFor="signUpBusinessFirstName">
                        Full Name
                      </label>
                      <div className="row gap-sm-3 signUpFullNameContent">
                        <div className="col-md-6">
                          <input 
                            type='text'
                            id='signUpBusinessFirstName'
                            placeholder='First Name'
                            {...register('businessFirstName')}
                            className={`form-control signUpInput ${errors.businessFirstName ? 'inputError' : ''}`}
                          />
                          {
                            errors.businessFirstName 
                            &&
                            (<span className='errorMessage'>{errors.businessFirstName.message}</span>)
                          }
                        </div>
                        <div className="col-md-6">
                          <input 
                            type='text'
                            id='signUpBusinessLastName'
                            placeholder='Last Name'
                            {...register('businessLastName')}
                            className={`form-control signUpInput ${errors.businessLastName ? 'inputError' : ''}`}
                          />
                          {
                            errors.businessLastName 
                            &&
                            (<span className='errorMessage'>{errors.businessLastName.message }</span>)
                          }
                        </div>
                      </div>
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusinessContactTitle">
                      Your Title
                    </label>
                    <input 
                      type='text'
                      id='signUpBusinessContactTitle'
                      placeholder='title in the company'
                      {...register('businessContactTitle')}
                      className={`form-control signUpInput ${errors.businessContactTitle ? 'inputError' : ''}`}
                    />
                    {
                      errors.businessContactTitle 
                      &&
                      (<span className='errorMessage'>{errors.businessContactTitle.message}</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusinessUserName">
                      User Name
                    </label>
                    <input 
                      type='text'
                      id='signUpBusinessUserName'
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
                    <label htmlFor="signUpBusnissContactCountry">
                      Country / Region
                    </label>
                    <div className="position-relative">
                      <select
                      id="signUpBusnissContactCountry" 
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
                    <label htmlFor="signUpBusinessPassword">
                      Password
                    </label>
                    <div className="position-relative">
                      <input 
                        type={`${showPassword ? 'text' : 'password'}`}
                        id='signUpBusinessPassword'
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
                    <label htmlFor="signUpBusinessMobileNumber">
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
                          id='signUpBusinessMobileNumber'
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
                    <label htmlFor="signUpBusinessConfirmPassword">
                    Confirm Password
                    </label>
                    <div className="position-relative">
                      <input 
                        type={`${showConfirmPassword ? 'text' : 'password'}`}
                        id='signUpBusinessConfirmPassword'
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
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusinessEmailAddress">
                      E-mail Address
                    </label>
                    <input 
                      type='text'
                      id='signUpBusinessEmailAddress'
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
                    <div className="row">
                      <div className="col-lg-9">
                        <label htmlFor="signUpBusinessCitizenship">
                          Citizenship
                        </label>
                        <input 
                          type='text'
                          id='signUpBusinessCitizenship'
                          placeholder='Enter your ID or Passport Number'
                          {...register('citizenship')}
                          className={`form-control signUpInput ${errors.citizenship ? 'inputError' : ''}`}
                        />
                        {
                          errors.citizenship
                          &&
                          (<span className='errorMessage'>{errors.citizenship.message}</span>)
                        }
                      </div>
                      <div className='col-lg-3'>
                        <label htmlFor="signUpBusinessCitizenshipFile" className='singUp__upLoadBtn'>
                          Upload
                        </label>
                        <input 
                          type='file'
                          id='signUpBusinessCitizenshipFile'
                          {...register('citizenshipFile')}
                          className={`signUpInput ${errors.citizenshipFile ? 'inputError' : ''}`}
                        />
                        {
                          errors.citizenshipFile
                          &&
                          (<p className='errorMessage'>{errors.citizenshipFile.message}</p>)
                        }
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 mb-4">
                    <label htmlFor="singUpBusinessConfirmCheckBox" className='row justify-content-start align-items-start'>
                      <p className="signUpCostom-checkBox col-md-1 col-sm-2 mt-1">
                        <input
                          type="checkbox"
                          id="singUpBusinessConfirmCheckBox"
                          {...register('confirmCheckBox')}
                          className='signUpCheckBox'
                        />
                        <span className="checkmark"></span>
                      </p>
                      <p className="col-md-11 p-0 col-sm-10 checkBox-text">
                        I confirm of acting on own behalf or on behalf of registered business, and I commit to updating the beneficial ownership information whenever a change has been made
                      </p>
                    </label>
                    {errors.confirmCheckBox && <p className='errorMessage'>{errors.confirmCheckBox.message}</p>}
                  </div>
                  <div className="signUpAddressBtn col-lg-12 text-center">
                    <span>Save and continue</span>
                  </div>

                  <div className="col-lg-12">
                    <BusinessSignUpPackages />
                  </div>

                  <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                    <input disabled={isSubmitting} type="submit" value={'Submit For Review'} />
                  </div>
                </form>
                <div className="col-lg-12 signUpOtherWays text-center pe-4">
                  <div className="serviceTerms">
                    <p className='businessPrivacy'>
                      Once you submit for review our Team will start reviewing all the details, you will be notified through your E-mail within 5-7 business days.
                    </p>
                    <p>
                      By continuing, you agree to ReachMagnet's<br />  Terms of Service and acknowledge that you've read our Privacy Policy. 
                    </p>
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
