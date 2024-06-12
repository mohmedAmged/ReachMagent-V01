import React from 'react';
import './companyContact.css';
import { ContactSchema } from '../../validation/ContactSchema';
import { useFormik } from 'formik';

export default function CompanyContact() {

  const onSubmit = async ( values , actions) => {
    const isValid = await ContactSchema.validate(values);
    };

  const { values , errors , touched , handleBlur , handleChange , handleSubmit} = useFormik({
    initialValues:{
      name: "",
      email: "",
      phone: "",
      description: ""
    },
    validationSchema: ContactSchema,
    onSubmit,
  });

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
              <form onSubmit={handleSubmit} onBlur={handleBlur} method='POST' className='p-5'>
                <div className='mb-4'>
                  <label htmlFor="fullNameCompanyContact">
                    Full Name
                  </label>
                  <input 
                  className={`w-100`}
                  type="text" 
                  name='fullNameCompanyContact' 
                  id='fullNameCompanyContact'
                  value={values?.name}
                  onChange={handleChange}
                  placeholder='Full Name' 
                  />
                  {/* {<p className='text-danger text-capitalize'></p>} */}
                </div>

                <div className='mb-4'>
                  <label htmlFor="phoneNumberCompanyContact">
                    Phone Number
                  </label>
                  <input 
                  className={`w-100`}
                  type="text" 
                  name="phoneNumberCompanyContact" 
                  id="phoneNumberCompanyContact"
                  value={values?.phone}
                  onChange={handleChange}
                  placeholder='Phone Number'
                  />
                  {/* { <p className='text-danger text-capitalize'></p>} */}
                </div>

                <div className='mb-4'>
                  <label htmlFor="emailCompanyContact">
                    E-mail Address
                  </label>
                  <input 
                  className={`w-100`}
                  type="email" 
                  name="emailCompanyContact" 
                  id="emailCompanyContact"
                  value={values?.email}
                  onChange={handleChange}
                  placeholder='E-mail Addriss'
                  />
                  {/* { <p className='text-danger text-capitalize'></p>} */}
                </div>

                <div className='mb-4'>
                  <label htmlFor="descriptionCompanyContact">
                    Description
                  </label>
                  <textarea
                  className={`w-100 `}
                  name="description" 
                  id="descriptionCompanyContact"
                  value={values?.description}
                  onChange={handleChange}
                  placeholder='Description'
                  ></textarea>
                  {/* { <p className='text-danger text-capitalize'></p>} */}
                </div>

                <button 
                className='contactCompany__form-submitBtn' 
                type='submit'
                id="submitCompanyFormBtn"
                name='submitCompanyFormBtn'
                >
                  submit
                </button>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}