import React, { useEffect, useState } from 'react'
import SignUpHead from '../../components/signUpHeadSec/SignUpHead';
import BusinessSignUpFormMainSec from '../../components/businessSignUpFormMainSec/BusinessSignUpFormMainSec';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function BusinessSignUp({ countries, industries, mainCategories, mainActivities }) {
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
            {/* <SignUpHead /> */}
            <BusinessSignUpFormMainSec
              countries={countries}
              industries={industries}
              mainCategories={mainCategories}
              mainActivities={mainActivities}
            />
          </div>
      }
    </>
  );
};
