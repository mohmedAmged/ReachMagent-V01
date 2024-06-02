import React from 'react'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeader/MainContentHeader'
export default function MyDashboard() {
  return (
    <>
    <div className='dashboard__handler d-flex'>
      <MyNewSidebarDash />
      <div className='main__content container'>
        <MainContentHeader />
        <div>Profile</div>
      </div>
    </div>
    </>
  );
};
