import React, { useEffect, useState } from 'react';
import './companyContact.css';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import FranchiseSec from '../franchiseSecc/FranchiseSec';

export default function CompanyContact({ loginType, token, companyId , company }) {
  const convertToUnderscore = (str) => {
    return str.replace(/\s+/g, '_');
  };
  const [formId, setFormId] = useState(undefined);
  const [formInputs, setFormInputs] = useState({});

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(()=>{
    if(!formId){
      setFormId(company?.data?.company?.companyForms[0]?.formId)
    }
  },[company]);

  useEffect(() => {
    if (token && formId) {
        (async () => {
            const toastId = toast.loading('Loading Forms...');
            await axios.post(`${baseURL}/${loginType}/show-form?t=${new Date().getTime()}`, {
                form_id: `${formId}`,
                company_id: companyId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                setFormInputs(response?.data?.data);
                toast.success(`Form Feilds Loaded Successfully.`, {
                    id: toastId,
                    duration: 1000,
                });
            }).catch(errors => {
                toast.error(`${errors?.response?.data?.message}`, {
                    id: toastId,
                    duration: 1000,
                });
            });
        })();
    };
}, [companyId, formId, loginType, token]);

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
      toast.success(`${response?.data?.message}.`, {
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
        toast.error(error?.response?.data?.message, {
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

      if (inputType === 'text' || inputType === 'email') {
        returnedData.push(<div className='mb-4'>
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
            <span className='errorMessage'>{errors[inputName].message}</span>
          }
        </div>);
      } else if (inputType === 'textarea') {
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
    return (returnedData);
  };

  return (
    <div className='contact__mainSec'>
      <div className="container">
        <div className="row">
          {
            token ? 
            <div className="col-lg-12">
            <div className="contactCompany-type">
              <ul className='d-flex flex-wrap'>
                {company?.data?.company?.companyForms?.map((el) => {
                  return (
                    <li key={el?.formId} onClick={() => {
                      console.log(el?.formId);
                      setFormId(el?.formId);
                    }} className={`${(+el?.formId === +formId) && 'contactCompany-type-active'}`}>
                      {el?.formTitle}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="contactCompany__form">
              
              <form method='POST' className='p-3' onSubmit={handleSubmit(onSubmit)}>
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
            : 
            <div className="col-12">
              <FranchiseSec
                  pageName='discover'
                  headText='Contact Form'
                  paraText='From general Inqueries to booking appointements'
                  btnOneText='Login To Continue'
                  btnOnelink='/login'
                />
            </div>
          }
          
        </div>
      </div>
    </div>
  );
};
