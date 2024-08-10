import React from 'react';
import './companyContact.css';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function CompanyContact({loginType,token,formInputs,companyId,formId,setFormId,company}) {
  const convertToUnderscore = (str) => {
    return str.replace(/\s+/g, '_');
  };

  const {
    register,
    handleSubmit,
    setError,
    reset ,
    formState:{errors, isSubmitting}
  } = useForm();

  const onSubmit = async (data) => {
    data.company_id = companyId;
    data.form_id = `${formId}`;
    const toastId = toast.loading('Please Wait...');
    await axios.post(`${baseURL}/${loginType}/fill-form`, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    }).then(response => {
      toast.success(`${response?.data?.message}.`,{
          id: toastId,
          duration: 1000
      });
      reset();
    })
    .catch(error => {
      if (error?.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach((key) => {
            setError(key, { message: error.response.data.errors[key][0] });
        });
      };
      toast.error(error?.response?.data?.message,{
        id: toastId,
        duration: 2000,
      });
    });
  };

  const gettingInputData = (form) => {
    const returnedData = [];
    form?.formFields?.map((input) => {
      const inputType = input?.type;
      const inputName = convertToUnderscore(input?.name);

      if(inputType === 'text' || inputType === 'email'){
        returnedData.push( <div className='mb-4'>
          <label htmlFor={`${inputName}CompanyContact`}>
            {input?.name}
          </label>
          <input 
          className={`w-100 ${errors[inputName] ? 'inputError' : ''}`}
          type={inputType}
          name={`${inputName}CompanyContact`}
          id={`${inputName}CompanyContact`}
          placeholder={input?.name}
          {...register(inputName, {
            required: `${inputName} is required`,
          })}
          />
          {
            errors[inputName] &&
            <span className='errorMessage'>{errors[inputName].message }</span>
          }
        </div>);
      }else if(inputType === 'textarea'){
        returnedData.push(
          <div className='mb-4'>
          <label htmlFor={`${inputName}CompanyContact`}>
            {input?.name}
          </label>
          <textarea
            className={`w-100 ${errors[inputName] ? 'inputError' : ''}`}
            type={inputType}
            name={`${inputName}CompanyContact`}
            id={`${inputName}CompanyContact`}
            placeholder={input?.name}
            {...register(inputName, {
              required: `${inputName} is required`,
            })}
          ></textarea>
          {
            errors[inputName] && 
            <span className='errorMessage'>{errors[inputName].message}</span>
          }
        </div>
        );
      };
    });
    return(returnedData);
  };


  return (
    <div className='contact__mainSec'>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="contactCompany-type">
              <ul className='d-flex flex-wrap'>
                {company?.data?.company?.companyForms?.map((el)=>{
                  return (
                    <li key={el?.formId} onClick={()=>{
                      setFormId(el?.formId);
                    }} className={`${(+el?.formId === +formId) && 'contactCompany-type-active'}`}>
                      {el?.formTitle}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="contactCompany__form">
              <h4>
                If you would like to contact Homzmart please fill out the form below and someone from their department will reach out to you
              </h4>
              <form method='POST' className='p-5' onSubmit={handleSubmit(onSubmit)}>
                {gettingInputData(formInputs)}
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
};
