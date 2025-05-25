import React, { useEffect, useState } from 'react';
import SignUpHead from '../../components/signUpHeadSec/SignUpHead'
import ResetPasswordForm from '../../components/resetPasswordFormMainSec/ResetPasswordForm'
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';

export default function ResetPassword() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyNewLoader />
                    :
                    <div className='signUp__page replace__margin__with__padding'>
                        {/* <SignUpHead /> */}
                        <ResetPasswordForm />
                    </div>
            }
        </>
    )
}
