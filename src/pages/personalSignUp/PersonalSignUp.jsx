import React, { useEffect, useState } from 'react';
import './regester.css';
import PersonalSignUpFormMainSec from '../../components/personalSignUpFormMainSec/PersonalSignUpFormMainSec';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { GetAllCountriesStore } from '../../store/AllCountries';
import { GetAllIndustriesStore } from '../../store/AllIndustries';
import { GetAllCitizenshipsStore } from '../../store/AllCitizenships';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';

export default function PersonalSignUp() {
  const [loading, setLoading] = useState(true);
  const countries = GetAllCountriesStore((state) => state.countries);
  const industries = GetAllIndustriesStore((state) => state.industries);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [loading]);

  return (
    <>
      {
        loading ?
          <MyNewLoader />
          :
          <div className='signUp__page'>
            <PersonalSignUpFormMainSec
              countries={countries}
              industries={industries}
              isSignUp={true}
            />
          </div>
      }
    </>
  );
};
