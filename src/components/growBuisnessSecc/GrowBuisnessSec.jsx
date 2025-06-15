import React from 'react'
import './growBuisnessSec.css'
import { NavLink } from 'react-router-dom'
import { scrollToTop } from '../../functions/scrollToTop';
import { useTranslation } from 'react-i18next';
export default function GrowBuisnessSec() {
        const { t } = useTranslation();
    return (
        <div className='growBuisness__handler'>
            <div className="container">
                <div className="growBuisness__content">
                    <div className="growBuisness__header">
                        <h1>
                           {t('growBuisnessHome.header')}
                        </h1>
                        <p>
                            {t('growBuisnessHome.subHeader')}
                        </p>
                    </div>
                    <div className="gowBuisness__action">
                        <NavLink className={'nav-link'} to={'/business-signUp'}
                            onClick={() => {
                                scrollToTop();
                            }}>
                            <button className='linear__btn'>
                                {t('growBuisnessHome.btnGrow')}
                            </button>
                        </NavLink>

                    </div>
                </div>
            </div>
        </div>
    )
}
