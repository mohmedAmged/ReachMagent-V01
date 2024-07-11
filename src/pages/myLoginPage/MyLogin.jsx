import React from 'react';
import './myLogin.css';
import SignUpHead from '../../components/signUpHeadSec/SignUpHead';
import SignInFormMainSec from '../../components/signInFormMainSec/SignInFormMainSec';

export default function MyLogin({loginType,setLoginType}) {
    return (
        <div className='signUp__page'>
            <SignUpHead />
            <SignInFormMainSec 
                loginType={loginType}
                setLoginType={setLoginType}
            />
        </div>
    );
};
