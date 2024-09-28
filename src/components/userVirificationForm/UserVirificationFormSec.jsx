import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { UserVirificationSchema } from '../../validation/UserVirification';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function UserVirificationFormSec({token}) {
  const [timer,setTimer] = useState(true);
  const navigate = useNavigate();

  if(timer === false){
    setTimeout(()=>{
      setTimer(true);
    },1000 * 60);
  };

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      otp: ''
    },
    resolver: zodResolver(UserVirificationSchema),
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading('Loading...');
    await axios.post(`${baseURL}/user/verify-account`,data,{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json',
        Accept: 'application/json'
      }
    })
    .then(res => {
      toast.success(res?.data?.message || 'Verified Successfully!',{
        id: toastId,
        duration: 1000
      });
      navigate(`/profile/profile-settings`);
    })
    .catch(err => {
      toast.error(err?.response?.data?.message || 'Something Went Wrong!',{
        id: toastId,
        duration: 1000
      })
    });
  };

  const handleResendCode = async ()=>{
    const toastId = toast.loading('Loading...');
    await axios.post(`${baseURL}/user/resend-verify-code`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json',
        Accept: 'application/json'
      }
    })
    .then(res => {
      toast.success(res?.data?.message || 'Verified Successfully!',{
        id: toastId,
        duration: 1000
      })
    })
    .catch(err => {
      toast.error(err?.response?.data?.message || 'Something Went Wrong!',{
        id: toastId,
        duration: 1000
      })
    })
  };

  return (
    <div className='signUpForm__mainSec py-5 mb-5'>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="signUpForm__mainContent">
              <div className="row">
                <h3 className="col-12 text-center py-5 signUpForm__head">
                  Verify Account
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className='row justify-content-center'>
                  <div className="col-lg-8 mb-4">
                    <label htmlFor="userVerificationInput">
                      Verification Code <span className="requiredStar">*</span>
                    </label>
                    <input
                      type='text'
                      id='userVerificationInput'
                      placeholder='123 456 789'
                      {...register('otp')}
                      className={`form-control signUpInput ${errors.otp ? 'inputError' : ''}`}
                    />
                    {
                      errors.otp
                      &&
                      (<span className='errorMessage'>{errors.otp.message}</span>)
                    }
                  </div>
                  <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                    <input
                      disabled={isSubmitting}
                      type="submit"
                      value={'Verify'}
                    />
                    <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                      <button onClick={handleResendCode} disabled={!timer} type="button" className={`prevStep__btn ${timer ? '':'opacityDisabled'}`}>
                        Resend Code
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
