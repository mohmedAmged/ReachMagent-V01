import React from 'react'
import SignUpHead from '../../components/signUpHeadSec/SignUpHead';
import BusinessSignUpFormMainSec from '../../components/businessSignUpFormMainSec/BusinessSignUpFormMainSec';

export default function BusinessSignUp() {
  return (
    <div className='signUp__page'>
      <SignUpHead />
      <BusinessSignUpFormMainSec />
    </div>
  );
};
