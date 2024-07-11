import React, { useEffect, useState } from 'react'
import './companyDashboard.css';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import CompanyDashboardProfileForm from '../../components/companyDashboardProfileFormSec/CompanyDashboardProfileForm';
import Cookies from 'js-cookie';

localStorage.setItem('updatingProfile','notUpdating');

export default function MyDashboard({token,countries}) {
  const [profileUpdateStatus,setProfileUpdateStatus] = useState(localStorage.getItem('updatingProfile'));
  const [currentUserLogin,setCurrentUserLogin] = useState(null);

  useEffect(() => {
    const cookiesData = Cookies.get('currentEmployeeData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
}, [Cookies.get('currentEmployeeData'),currentUserLogin]);

  return (
    <>
    <div className='dashboard__handler d-flex signUpForm__mainSec'>
      <MyNewSidebarDash />
      <div className='main__content container signUpForm__mainContent'>
        <MainContentHeader currentUserLogin={currentUserLogin} />
        <div className='col-12 my-3'>
          <CompanyDashboardProfileForm 
            setProfileUpdateStatus={setProfileUpdateStatus}
            currentUserLogin={currentUserLogin}
            setCurrentUserLogin={setCurrentUserLogin}
            profileUpdateStatus={profileUpdateStatus}
            countries={countries}
            token={token}
          />
        </div>
      </div>
    </div>
    </>
  );
};
