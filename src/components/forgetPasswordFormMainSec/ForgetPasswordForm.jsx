import React from 'react'
export default function ForgetPasswordForm() {
    return (
        <div className='signUpForm__mainSec py-5 mb-5'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className='signUpForm__mainContent'>
                            <div className='row'>
                                <h3 className="col-12 text-center pt-5 signUpForm__head">
                                    Forget your password
                                </h3>
                                <form action="" className='row justify-content-center'>
                                    <div className="col-lg-8 my-5">
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
                                    <div className="col-lg-12 text-center mt-3 signUp__submitBtn">
                                        <input
                                            // disabled={isSubmitting}
                                            type="submit"
                                            value={'Reset Password'}
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
