import React from 'react'
import SignUpHead from '../../components/signUpHeadSec/SignUpHead';
import BusinessSignUpFormMainSec from '../../components/businessSignUpFormMainSec/BusinessSignUpFormMainSec';

export default function BusinessSignUp({countries,industries,mainCategories,mainActivities}) {
  return (
    <div className='signUp__page'>
      <SignUpHead />
      <BusinessSignUpFormMainSec
        countries={countries}
        industries={industries} 
        mainCategories={mainCategories} 
        mainActivities={mainActivities} 
      />
    </div>
  );
};
