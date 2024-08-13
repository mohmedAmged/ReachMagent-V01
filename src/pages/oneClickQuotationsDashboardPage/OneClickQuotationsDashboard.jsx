import React from 'react';
import QuotationStateSec from '../../components/quotationsStateSecc/QuotationStateSec';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import OneClickQuotationTable from '../../components/oneClickQuotationTableSec/OneClickQuotationTable';

export default function OneClickQuotationsDashboard({token}) {
  return (
    <>
    <div className='dashboard__handler d-flex'>
      <MyNewSidebarDash />
      <div className='main__content container'>
        <MainContentHeader />
        <div className='myQuotations__handler '>
          <QuotationStateSec />
          <OneClickQuotationTable token={token}/>
        </div>
      </div>
    </div>
    </>
  );
};
