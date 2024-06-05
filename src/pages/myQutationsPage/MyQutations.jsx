import React from 'react'
import QuotationStateSec from '../../components/quotationsStateSec/QuotationStateSec'
import QuotationTableSec from '../../components/quotationTableSec/QuotationTableSec'
import MainContentHeader from '../../components/mainContentHeader/MainContentHeader'
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
