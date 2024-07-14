import React from 'react'
import { Toaster } from 'react-hot-toast'

export default function ResetPasswordForm() {
    return (
        <div className='signUpForm__mainSec py-5 mb-5'>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className='signUpForm__mainContent'>
                            <div className='row'>
                                <h3 className="col-12 text-center pt-5 signUpForm__head">
                                    Reset your password
                                </h3>
                                <form action="" className='row justify-content-center'>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInEmailAddress">
                                            E-mail Address <span className="requiredStar">*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='signInEmailAddress'
                                            placeholder='Enter your existing email'
                                            className={`form-control signUpInput`}
                                        />
                                        {/* {
                                            errors.email
                                            &&
                                            (<span className='errorMessage'>{errors.email.message}</span>)
                                        } */}
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInEmailAddress">
                                            OTP <span className="requiredStar">*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='signInEmailAddress'
                                            placeholder='Enter OTP'
                                            className={`form-control signUpInput`}
                                        />
                                        {/* {
                                            errors.email
                                            &&
                                            (<span className='errorMessage'>{errors.email.message}</span>)
                                        } */}
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInPassword">
                                            New Password <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                // type={`${showPassword ? 'text' : 'password'}`}
                                                id='signInPassword'
                                                placeholder='Enter 8-digit password'
                                                // {...register('password')}
                                                className={`form-control signUpInput 
                                                `}
                                            />
                                            {/* <div className="leftShowPasssord" onClick={()=>setShowPassword(!showPassword)}>
                                            {
                                                showPassword ?
                                                <i className="bi bi-eye-slash"></i>
                                                :
                                                <i className="bi bi-eye-fill"></i>
                                            }
                                            </div> */}
                                        </div>
                                        {/* {
                                                errors.password
                                                &&
                                                (<span className='errorMessage'>{errors.password.message}</span>)
                                            } */}
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInPassword">
                                            Confirm Password <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                // type={`${showPassword ? 'text' : 'password'}`}
                                                id='signInPassword'
                                                placeholder='Enter 8-digit password'
                                                // {...register('password')}
                                                className={`form-control signUpInput 
                                                `}
                                            />
                                            {/* <div className="leftShowPasssord" onClick={()=>setShowPassword(!showPassword)}>
                                            {
                                                showPassword ?
                                                <i className="bi bi-eye-slash"></i>
                                                :
                                                <i className="bi bi-eye-fill"></i>
                                            }
                                            </div> */}
                                        </div>
                                        {/* {
                                                errors.password
                                                &&
                                                (<span className='errorMessage'>{errors.password.message}</span>)
                                            } */}
                                    </div>
                                    <div className="col-lg-12 text-center mt-3 signUp__submitBtn">
                                        <input
                                            // disabled={isSubmitting}
                                            type="submit"
                                            value={'Submit'}
                                        />
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
