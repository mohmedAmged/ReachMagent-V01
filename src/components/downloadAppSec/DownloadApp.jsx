import React from 'react'
import './downloadApp.css'
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec'
import googlePlayBtn from '../../assets/logos/googleplayBtn.png'
import appStoreBtn from '../../assets/logos/appStoreBtn.png'
import { NavLink } from 'react-router-dom'
export default function DownloadApp() {
    return (
        <div className='downloadAppSec__handler'>
            <div className="container">
                <HeaderOfSec
                    secHead='Download our New Application'
                    secText='Dicover The Next Wave in Digital Collectible : Unveiling an Sales Application Revolutionzingthe marketplace'
                />
                <div className="downloadAppSec__btnss">
                    <>
                        <NavLink to={''} className='nav-link btnForDownload'>
                            <img src={googlePlayBtn} alt="btn__app" />
                        </NavLink>
                        <NavLink to={''} className='nav-link btnForDownload'>
                            <img src={appStoreBtn} alt="btn__app" />
                        </NavLink>
                    </>
                </div>
            </div>
        </div>
    )
}
