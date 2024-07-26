import React from 'react'
import './myProfileFrom.css'
import { scrollToTop } from '../../functions/scrollToTop';
export default function MyProfileForm() {
    return (
        <form className='profileForm__handler my-4' >
            <div className="mt-2 profileFormInputItem">
                <label htmlFor="dashboardEmployeeName">First Name</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 `}
                // {...register('name')}
                // type="text"
                // disabled={profileUpdateStatus === 'notUpdating'}
                />
                {/* {
                                        errors?.name
                                        &&
                                        (<span className='errorMessage'>{errors?.name?.message}</span>)
                                    } */}
            </div>
            <div className="mt-2 profileFormInputItem">
                <label htmlFor="dashboardEmployeeName">last Name</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 `}
                // {...register('name')}
                // type="text"
                // disabled={profileUpdateStatus === 'notUpdating'}
                />
                {/* {
                                        errors?.name
                                        &&
                                        (<span className='errorMessage'>{errors?.name?.message}</span>)
                                    } */}
            </div>
            <div className="mt-2 profileFormInputItem">
                <label htmlFor="dashboardEmployeeName">Phone Number</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 `}
                // {...register('name')}
                // type="text"
                // disabled={profileUpdateStatus === 'notUpdating'}
                />
                {/* {
                                        errors?.name
                                        &&
                                        (<span className='errorMessage'>{errors?.name?.message}</span>)
                                    } */}
            </div>
            <div className="mt-2 profileFormInputItem">
                <label htmlFor="dashboardEmployeeName">Email Address</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 `}
                // {...register('name')}
                // type="text"
                // disabled={profileUpdateStatus === 'notUpdating'}
                />
                {/* {
                                        errors?.name
                                        &&
                                        (<span className='errorMessage'>{errors?.name?.message}</span>)
                                    } */}
            </div>
            <div className="mt-2 profileFormInputItem">
                <label htmlFor="dashboardEmployeeName">City</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 `}
                // {...register('name')}
                // type="text"
                // disabled={profileUpdateStatus === 'notUpdating'}
                />
                {/* {
                                        errors?.name
                                        &&
                                        (<span className='errorMessage'>{errors?.name?.message}</span>)
                                    } */}
            </div>
            <div className="mt-2 profileFormInputItem">
                <label htmlFor="dashboardEmployeeName">state</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 `}
                // {...register('name')}
                // type="text"
                // disabled={profileUpdateStatus === 'notUpdating'}
                />
                {/* {
                                        errors?.name
                                        &&
                                        (<span className='errorMessage'>{errors?.name?.message}</span>)
                                    } */}
            </div>
            <div className="mt-2 profileFormInputItem">
                <label htmlFor="dashboardEmployeeName">Country</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 `}
                // {...register('name')}
                // type="text"
                // disabled={profileUpdateStatus === 'notUpdating'}
                />
                {/* {
                                        errors?.name
                                        &&
                                        (<span className='errorMessage'>{errors?.name?.message}</span>)
                                    } */}
            </div>
            <div className="mt-2 profileFormInputItem">
                <label htmlFor="dashboardEmployeeName">Country</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 `}
                // {...register('name')}
                // type="text"
                // disabled={profileUpdateStatus === 'notUpdating'}
                />
                {/* {
                                        errors?.name
                                        &&
                                        (<span className='errorMessage'>{errors?.name?.message}</span>)
                                    } */}
            </div>
            <div className={`bottomContainer pt-5 
                  text-center
                  `}>
                {
                    // (profileUpdateStatus === 'notUpdating') ?
                        <span className='startUpdateBtn' onClick={() => {
                            scrollToTop();
                            // localStorage.setItem('updatingProfile', 'updating');
                            // setProfileUpdateStatus(localStorage.getItem('updatingProfile'));
                        }}>Update</span>
                        // :
                        // <input type="submit" disabled={isSubmitting} value="Confirm Changes" className='updateBtn' />
                }
            </div>
        </form>
    )
}
