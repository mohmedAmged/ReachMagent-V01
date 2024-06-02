import React from 'react'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeader/MainContentHeader'
import { NavLink } from 'react-router-dom';

export default function MyDashboard() {
  return (
    <>
    <div className='dashboard__handler d-flex'>
      <MyNewSidebarDash />
      <div className='main__content container'>
        <MainContentHeader />
        <div>Profile</div>
        <NavLink className='btn btn-outline-success py-3 px-4 mt-4' to='/'>
          Back To Home Page
        </NavLink>
      </div>
    </div>
    </>
  );
};
