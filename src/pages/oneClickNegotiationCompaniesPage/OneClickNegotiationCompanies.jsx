import React, { useEffect, useState } from 'react'
import QuotationStateSec from '../../components/quotationsStateSecc/QuotationStateSec';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import OneClickNegotiationTable from '../../components/oneClickNegotiationTableSec/OneClickNegotiationTable';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function OneClickNegotiationCompanies({ token }) {
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
          <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
              <MainContentHeader />
              <div className='myQuotations__handler '>
                <QuotationStateSec />
                <OneClickNegotiationTable token={token} />
              </div>
            </div>
          </div>
      }
    </>
  );
};
