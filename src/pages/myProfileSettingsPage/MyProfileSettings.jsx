import React, { useEffect, useRef, useState } from 'react'
import './myProfileSettings.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import cover from '../../assets/heroSec/singleCompanyQuote.png'
import camerIcon from '../../assets/signUpImages/camera-icon.png'
import ProfileFilterBar from '../../components/profileFilterBarSec/ProfileFilterBar'
import MyProfileForm from '../../components/myProfileFormSec/MyProfileForm'
import UpdatePassword from '../../components/updatePasswordSec/UpdatePassword'
import Cookies from 'js-cookie';
import MyLoader from '../../components/myLoaderSec/MyLoader'
import { GetAllCountriesStore } from '../../store/AllCountries'
import CompanyFollowIndustryFrom from '../../components/companyFollowIndustryFormSec/CompanyFollowIndustryFrom'
import CompanyTimezoneForm from '../../components/companyTimezoneFormItem/CompanyTimezoneForm'
import EmployeeTimezoneForm from '../../components/employeeTimezoneFormItem/EmployeeTimezoneForm'
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader'
import { useTranslation } from 'react-i18next'

localStorage.setItem('updatingProfile', 'notUpdating');

export default function MyProfileSettings({ token }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [profileUpdateStatus, setProfileUpdateStatus] = useState(localStorage.getItem('updatingProfile'));
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [currentImage, setCurrentImage] = useState(JSON.parse(Cookies.get('currentLoginedData'))?.image );
    const [currnetImageUpdateFile, setCurrentImageUpdateFile] = useState(undefined);
    const [currnetImageUpdateError, setCurrentImageUpdateError] = useState('');
    const [imgChanged, setImageChanged] = useState(false);
    const loginType = localStorage.getItem('loginType');
    const [unAuth, setUnAuth] = useState(false);
    const countries = GetAllCountriesStore((state) => state.countries);
    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            if (localStorage.getItem('loginType') === 'employee') {
                setCurrentUserLogin(newShape);
            } else if (localStorage.getItem('loginType') === 'user') {
                setCurrentUserLogin(newShape);
            };
        };
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [activeItem, setActiveItem] = useState('Account Settings');
    let items = [
        { name: 'Account Settings', active: activeItem === 'Account Settings', rendeName: `${t('DashboardProileSettingsPage.accountSettingsFilterItem')}` },
        { name: 'Password Settings', active: activeItem === 'Password Settings', rendeName: `${t('DashboardProileSettingsPage.passwordSettingsfilterItem')}` },
    ];
    if (loginType === 'user') {
        items = [
            { name: 'Account Settings', active: activeItem === 'Account Settings', rendeName: `${t('DashboardProileSettingsPage.accountSettingsFilterItem')}` },
            { name: 'User Industries', active: activeItem === 'User Industries', rendeName: `${t('DashboardProileSettingsPage.userIndustriesFilterItem')}` },
            { name: 'User Timezone', active: activeItem === 'User Timezone', rendeName: `${t('DashboardProileSettingsPage.userTimezoneFilterItem')}` },
            { name: 'Password Settings', active: activeItem === 'Password Settings', rendeName: `${t('DashboardProileSettingsPage.passwordSettingsfilterItem')}` },
        ];
    }
    if (loginType === 'employee') {
        items = [
            { name: 'Account Settings', active: activeItem === 'Account Settings', rendeName: `${t('DashboardProileSettingsPage.accountSettingsFilterItem')}` },
            { name: 'Employee Timezone', active: activeItem === 'Employee Timezone', rendeName: `${t('DashboardProileSettingsPage.employeeTimezoneFilterItem')}` },
            { name: 'Password Settings', active: activeItem === 'Password Settings', rendeName: `${t('DashboardProileSettingsPage.passwordSettingsfilterItem')}` },
        ];
    }
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        if (profileUpdateStatus !== 'notUpdating') {
            fileInputRef.current.click();
        };
    };

    const hangleChangeImage = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const newFileUrl = URL.createObjectURL(selectedFile);
            setCurrentImage(newFileUrl);
            setImageChanged(true);
        };
        setCurrentImageUpdateFile(event.target.files);
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, [loading]);


    return (
        <>
            {
                loading ?
                    <MyNewLoader />
                    :
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash loginType={loginType} />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            <div className="profileCoverImgUserAndOwner">
                                {/* <img src={cover} alt="" /> */}
                            </div>
                            <div className='content__view__handler'>
                                <div className="profile__settings__content row justify-content-center">
                                    <div className="left__settings__content col-lg-4">
                                        <div className="change__img__box">
                                            <div className="profile__image__box">
                                                <img src={currentImage} alt="profile" />
                                            </div>
                                            <div className={`camera__icon ${profileUpdateStatus === 'updating' && 'cursorPointer'}`}>
                                                {
                                                    profileUpdateStatus !== 'notUpdating' &&
                                                    <input type="file" className='invisibleInput' ref={fileInputRef} onChange={hangleChangeImage} />
                                                }
                                                <img src={camerIcon} alt="camera" onClick={handleImageClick} />
                                            </div>
                                        </div>
                                        {
                                            currnetImageUpdateError &&
                                            (<span className='errorMessage text-center d-block mb-3'>{currnetImageUpdateError}</span>)
                                        }
                                        <div className="user__name__info">
                                            <h3>
                                                {currentUserLogin?.name}
                                            </h3>
                                            {
                                                loginType !== 'user' &&
                                                <p>
                                                    {currentUserLogin?.companyName}
                                                </p>
                                            }
                                        </div>
                                        {/* <div className="view__profile__btn">
                                            <button>
                                                View public profile
                                            </button>
                                        </div> */}
                                    </div>
                                    <div className="right__settings__content col-lg-7">
                                        <div className="profile__filter__bar">
                                            <ProfileFilterBar items={items} onItemClick={handleItemClick} />
                                        </div>
                                        <div className="profile__form__inputs mt-3 pb-5">
                                            {activeItem === 'Account Settings' &&
                                                <MyProfileForm
                                                    imgChanged={imgChanged}
                                                    currnetImageUpdateFile={currnetImageUpdateFile}
                                                    setCurrentImageUpdateError={setCurrentImageUpdateError}
                                                    setCurrentImage={setCurrentImage}
                                                    setProfileUpdateStatus={setProfileUpdateStatus}
                                                    currentUserLogin={currentUserLogin}
                                                    setCurrentUserLogin={setCurrentUserLogin}
                                                    profileUpdateStatus={profileUpdateStatus}
                                                    countries={countries}
                                                    token={token}
                                                />}
                                            {activeItem === 'User Industries' && <CompanyFollowIndustryFrom
                                                token={token}
                                            />}
                                            {activeItem === 'User Timezone' && <CompanyTimezoneForm
                                                setUnAuth={setUnAuth}
                                                token={token}
                                            />
                                            }
                                            {activeItem === 'Employee Timezone' && <EmployeeTimezoneForm
                                                setUnAuth={setUnAuth}
                                                token={token}
                                            />
                                            }
                                            {activeItem === 'Password Settings' && <UpdatePassword
                                                token={token}
                                            />}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
