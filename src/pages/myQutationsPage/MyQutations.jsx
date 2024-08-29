import React, { useEffect, useState } from 'react'
import QuotationStateSec from '../../components/quotationsStateSecc/QuotationStateSec'
import QuotationTableSec from '../../components/quotationTableSecc/QuotationTableSec'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MyLoader from '../../components/myLoaderSec/MyLoader'
import Cookies from 'js-cookie'
import UnAuthSec from '../../components/unAuthSection/UnAuthSec'

export default function MyQutations({ token }) {
  const [loading, setLoading] = useState(true);
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [unAuth, setUnAuth] = useState(false);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

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
              <MainContentHeader currentUserLogin={currentUserLogin} />
              <div className='myQuotations__handler '>
                <QuotationStateSec />
                {
                  unAuth ?
                    <UnAuthSec />
                    :
                    <QuotationTableSec setUnAuth={setUnAuth} token={token} />
                }
              </div>
            </div>
          </div>
      }
    </>
  )
}
