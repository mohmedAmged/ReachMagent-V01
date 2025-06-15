import React from 'react'
import './downloadApp.css'
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec'
import googlePlayBtn from '../../assets/logos/googleplayBtn.png'
import appStoreBtn from '../../assets/logos/appStoreBtn.png'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lang } from '../../functions/Token'
export default function DownloadApp() {
      const { t } = useTranslation();
    return (
        <div className='downloadAppSec__handler'>
            <div className="container">
                <HeaderOfSec
                    classNameRTL={Lang === 'ar' ? "header_ofSec_RTL" : "header_ofSec_LTR"}
                    secHead={t('downloadHome.header')}
                    secText={t('downloadHome.subHeader')}
                />
                <div className="downloadAppSec__btnss">
                    <div className='d-flex downloadAppSec__btnss__div  gap-5'>
                        <NavLink to={''} className='nav-link btnForDownload'>
                            <img src={googlePlayBtn} alt="btn__app" />
                        </NavLink>
                        <NavLink to={''} className='nav-link btnForDownload'>
                            <img src={appStoreBtn} alt="btn__app" />
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
