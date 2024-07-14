import React from 'react'
import SignUpHead from '../../components/signUpHeadSec/SignUpHead'
import ResetPasswordForm from '../../components/resetPasswordFormMainSec/ResetPasswordForm'

export default function ResetPassword() {
    return (
        <div className='signUp__page replace__margin__with__padding'>
            <SignUpHead />
            <ResetPasswordForm />
        </div>
    )
}
