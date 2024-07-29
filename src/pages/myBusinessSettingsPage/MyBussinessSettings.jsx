import React, { useEffect, useRef, useState } from 'react';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import cover from '../../assets/signUpImages/cover2.png';
import camerIcon from '../../assets/signUpImages/camera-icon.png';
import ProfileFilterBar from '../../components/profileFilterBarSec/ProfileFilterBar';
import CompanySettingsForm from '../../components/companySettingsFormSec/CompanySettingsForm';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

localStorage.setItem('updatingCompany','notUpdating');

export default function MyBussinessSettings({token,countries,mainCategories}) {
    const loginType = localStorage.getItem('loginType');
    const [company,setCompany] = useState({});
    const [currentImage,setCurrentImage] = useState(null);
    const [profileUpdateStatus,setProfileUpdateStatus] = useState(localStorage.getItem('updatingCompany'));
    const [currnetImageUpdateFile,setCurrentImageUpdateFile] = useState(undefined);
    const [currnetImageUpdateError,setCurrentImageUpdateError] = useState('');
    const [imgChanged,setImageChanged] = useState(false);
    const [currentUserLogin,setCurrentUserLogin] = useState(null);

    useEffect(()=>{
        if(loginType === 'employee' && token){
            (async () => {
                const toastId = toast.loading('Loading...');
                try {
                    const response = await axios.get(`${baseURL}/${loginType}/show-company`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json'
                        },
                    });
                    setCompany(response?.data?.data);
                    setCurrentImage(response?.data?.data?.logo);
                    toast.success('Company Loaded Successfully', {
                        id: toastId,
                        duration: 2000
                    });
                } catch (error) {
                    toast.error(error?.response?.data?.message || 'An error occurred', {
                        id: toastId,
                        duration: 2000
                    });
                }
            })();
        }
    },[]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            if(localStorage.getItem('loginType') === 'employee'){
                setCurrentUserLogin(newShape);
            }else if(localStorage.getItem('loginType') === 'user'){
                setCurrentUserLogin(newShape);
            };
        };
    }, [Cookies.get('currentLoginedData'),currentUserLogin]);

    const [activeItem, setActiveItem] = useState('Company Settings');
    const items = [
        { name: 'Company Settings', active: activeItem === 'Company Settings' },
        { name: 'Billing', active: activeItem === 'Billing' },
        { name: 'Notifications', active: activeItem === 'Notifications' },
    ];
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        if(profileUpdateStatus !== 'notUpdating'){
            fileInputRef.current.click();
        }
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

    return (
        <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
                <MainContentHeader currentUserLogin={currentUserLogin} />
                <div className='content__view__handler'>
                    <div className="profileCoverImg">
                        <img src={cover} alt="" />
                    </div>
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
                                    {company?.name}
                                </h3>
                            </div>
                            <div className="view__profile__btn">
                                <button>
                                    View company's public profile
                                </button>
                            </div>
                        </div>
                        <div className="right__settings__content col-lg-7">
                            <div className="profile__filter__bar">
                                <ProfileFilterBar items={items} onItemClick={handleItemClick} />
                            </div>
                            <div className="profile__form__inputs mt-3">
                                {activeItem === 'Company Settings' 
                                && 
                                <CompanySettingsForm 
                                    token={token} 
                                    imgChanged={imgChanged}
                                    currnetImageUpdateFile={currnetImageUpdateFile}
                                    setCurrentImageUpdateError={setCurrentImageUpdateError}
                                    setCurrentImage={setCurrentImage}
                                    setProfileUpdateStatus={setProfileUpdateStatus}
                                    company={company}
                                    setCurrentUserLogin={setCurrentUserLogin}
                                    profileUpdateStatus={profileUpdateStatus}
                                    countries={countries}
                                    mainCategories={mainCategories}
                                />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
