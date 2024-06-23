import React from 'react';
import './companyContact.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanyContactSchema } from '../../validation/CompanyContactSchema';


export default function CompanyContact() {
  const {
    register,
    handleSubmit,
    setError,
    formState:{errors , isSubmitting}
  } = useForm({
    defaultValues:{
      fullName: '',
      phoneNumber: '',
      email: '',
      description: '',
    },
    resolver: zodResolver(CompanyContactSchema),
  });

  const onSubmit = async (data) => {
    await new Promise((resolve)=> setTimeout(resolve,1000));
    console.log(data)
  };

  return (
    <div className='contact__mainSec'>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="contactCompany-type">
              <ul className='d-flex flex-wrap'>
                <li className='contactCompany-type-active'>
                  Contact Homzmart
                </li>
                <li>
                  Book an appointment
                </li>
                <li>
                  Sample Request
                </li>
              </ul>
            </div>
            <div className="contactCompany__form">
              <h4>
                If you would like to contact Homzmart please fill out the form below and someone from their department will reach out to you
              </h4>
              <form method='POST' className='p-5' onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4'>
                  <label htmlFor="fullNameCompanyContact">
                    Full Name
                  </label>
                  <input 
                  className={`w-100 ${errors.fullName ? 'inputError' : ''}`}
                  type="text" 
                  name='fullNameCompanyContact' 
                  id='fullNameCompanyContact'
                  placeholder='Full Name'
                  {...register('fullName')}
                  />
                  {
                    errors.fullName &&
                    <span className='errorMessage'>{errors.fullName.message}</span>
                  }
                </div>

                <div className='mb-4'>
                  <label htmlFor="phoneNumberCompanyContact">
                    Phone Number
                  </label>
                  <input 
                  className={`w-100 ${errors.phoneNumber ? 'inputError' : ''}`}
                  type="text" 
                  name="phoneNumberCompanyContact" 
                  id="phoneNumberCompanyContact"
                  placeholder='Phone Number'
                  {...register('phoneNumber')}
                  />
                  {
                    errors.phoneNumber &&
                    <span className='errorMessage'>{errors.phoneNumber.message}</span>
                  }
                </div>

                <div className='mb-4'>
                  <label htmlFor="emailCompanyContact">
                    E-mail Address
                  </label>
                  <input 
                  className={`w-100 ${errors.email ? 'inputError' : ''}`}
                  type="email" 
                  name="emailCompanyContact" 
                  id="emailCompanyContact"
                  placeholder='E-mail Addriss'
                  {...register('email')}
                  />
                  {
                    errors.email &&
                    <span className='errorMessage'>{errors.email.message}</span>
                  }
                </div>

                <div className='mb-4'>
                  <label htmlFor="descriptionCompanyContact">
                    Description
                  </label>
                  <textarea
                  className={`w-100 ${errors.description ? 'inputError' : ''}`}
                  name="description" 
                  id="descriptionCompanyContact"
                  placeholder='Description'
                  {...register('description')}
                  ></textarea>
                  {
                    errors.description && 
                    <span className='errorMessage'>{errors.description.message}</span>
                  }
                </div>

                <input 
                className='contactCompany__form-submitBtn' 
                type='submit'
                id="submitCompanyFormBtn"
                name='submitCompanyFormBtn'
                value={isSubmitting ? 'Sending ...' : 'Submit'}
                disabled={isSubmitting}
                />
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}