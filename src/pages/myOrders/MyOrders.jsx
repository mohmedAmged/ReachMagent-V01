import React from 'react'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'

export default function MyOrders() {
  return (
    <>
    <div className='dashboard__handler d-flex'>
      <MyNewSidebarDash />
      <div className='main__content container'>
        <MainContentHeader />
        <div>orders content</div>
      </div>
    </div>
    </>
  )
}
