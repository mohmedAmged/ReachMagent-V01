import React from 'react';
import './regester.css';
import SignUpHead from '../../components/signUpHeadSec/SignUpHead';
import PersonalSignUpFormMainSec from '../../components/personalSignUpFormMainSec/PersonalSignUpFormMainSec';

export default function PersonalSignUp({countries,industries}) {

  return (
    <div className='signUp__page'>
      <SignUpHead />
      <PersonalSignUpFormMainSec 
        countries={countries}
        industries={industries}
      />
    </div>
  );
};
