import React from 'react'
import SignUpHead from '../../components/signUpHeadSec/SignUpHead'
import ForgetPasswordForm from '../../components/forgetPasswordFormMainSec/ForgetPasswordForm'

export default function EnterUrEmail() {
  const loginType = localStorage.getItem('loginType');
  return (
    loginType === 'user'
    &&
    <div className='signUp__page replace__margin__with__padding'>
      <SignUpHead />
      <ForgetPasswordForm />
    </div>
  )
}
