import React, { useEffect } from 'react';
import './mainContentHeader.css';
import MySearchSec from '../mySearchSec/MySearchSec';
import messageIcon from '../../assets/companyImages/messages-3.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { GetAllChatsStore } from '../../store/AllChats';
import { GetAllCountriesStore } from '../../store/AllCountries';
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories';
import { useActivePackageStore } from '../../store/ActivePackageStore';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';


export default function MainContentHeader({ isSidebarExpanded, search, placeholder, currentUserLogin, filteration, setFilteration, name, inputType }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const allRead = GetAllChatsStore((state) => state.allRead);
    const getAllChats = GetAllChatsStore((state) => state.getAllChats);
    const getAllCountries = GetAllCountriesStore((state) => state.getAllCountries);
    const getAllMainCategories = GetAllMainCategoriesStore((state) => state.getAllMainCategories);
    useEffect(() => {
        getAllChats();
        getAllCountries(); 
        getAllMainCategories();
    }, [getAllChats, getAllCountries,getAllMainCategories]);

    const loginType = localStorage.getItem('loginType')
    const {
        loading,
        features,
        message,
        fetchActivePackage,
        unAuth,
    } = useActivePackageStore();
    useEffect(() => {
        fetchActivePackage( loginType);
    }, [loginType, fetchActivePackage]);
    return (
        <div className={`mainContentHeader__handler  ${isSidebarExpanded ? 'expanded' : ''}`}>
            <div className="content__header d-flex justify-content-between  align-items-center flex-wrap">
                <h1>
                    {t('DashboardMainHeader.helloHeader')} {currentUserLogin?.name?.split(' ')[0]} 👋🏼
                </h1>

                <div className='d-flex align-items-center flex-wrap gap-2'>
                    {
                        search &&
                        <MySearchSec name={name} placeholder={placeholder} filteration={filteration} setFilteration={setFilteration} inputType={inputType} />
                    }
                    { loginType === 'user' &&
                        <button onClick={() => navigate(`/your-messages`)} className='btn__companyActions online__btn'>
                        <NavLink className={'nav-link'}
                        >
                            <img src={messageIcon} alt="message-icon" />
                            {
                                allRead === false &&
                                <span className="red__dot"></span>
                            }
                        </NavLink>
                    </button>
                    }
                    { loginType === 'employee'  && features?.messaging === 'yes' &&
                        <button onClick={() => navigate(`/your-messages`)} className='btn__companyActions online__btn'>
                        <NavLink className={'nav-link'}
                        >
                            <img src={messageIcon} alt="message-icon" />
                            {
                                allRead === false &&
                                <span className="red__dot"></span>
                            }
                        </NavLink>
                    </button>
                    }
                    <NavLink className='btn btn-outline-success p-2 ms-2' to='/'>
                        <i className="bi bi-box-arrow-left "></i>
                        <span className={`${Lang === 'ar' ? "me-2" : "ms-2"}`}>{t('DashboardMainHeader.backToHomeBtn')}</span>
                    </NavLink>
                </div>

            </div>
        </div>
    )
}
