import React from 'react'
import QuotationStateSec from '../../components/quotationsStateSecc/QuotationStateSec'
import QuotationTableSec from '../../components/quotationTableSecc/QuotationTableSec'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'


export default function MyQutations() {
  return (
    <>
    <div className='dashboard__handler d-flex'>
      <MyNewSidebarDash />
      <div className='main__content container'>
        <MainContentHeader />
        <div className='myQuotations__handler '>
          <QuotationStateSec />
          <QuotationTableSec />
        </div>
      </div>
    </div>
    </>
  )
}
