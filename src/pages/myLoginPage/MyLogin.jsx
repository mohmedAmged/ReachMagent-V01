import React, { useEffect, useState } from 'react';
import './myLogin.css';
import SignUpHead from '../../components/signUpHeadSec/SignUpHead';
import SignInFormMainSec from '../../components/signInFormMainSec/SignInFormMainSec';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function MyLogin({ loginType, setLoginType }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='signUp__page'>
                        <SignUpHead />
                        <SignInFormMainSec
                            loginType={loginType}
                            setLoginType={setLoginType}
                        />
                    </div>
            }
        </>
    );
};
