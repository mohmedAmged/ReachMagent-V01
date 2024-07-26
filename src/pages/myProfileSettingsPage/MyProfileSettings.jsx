import React, { useState } from 'react'
import './myProfileSettings.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import cover from '../../assets/signUpImages/cover.png'
import profile from '../../assets/signUpImages/profile.png'
import camerIcon from '../../assets/signUpImages/camera-icon.png'
import ProfileFilterBar from '../../components/profileFilterBarSec/ProfileFilterBar'
import MyProfileForm from '../../components/myProfileFormSec/MyProfileForm'
import UpdatePassword from '../../components/updatePasswordSec/UpdatePassword'
export default function MyProfileSettings({token, }) {
    const [activeItem, setActiveItem] = useState('Account Settings');
    const items = [
        { name: 'Account Settings', active: activeItem === 'Account Settings' },
        { name: 'Password Settings', active: activeItem === 'Password Settings' },
        // Add more items as needed
    ];
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };
    return (
        <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
                <MainContentHeader />
                <div className='content__view__handler'>
                    <div className="profileCoverImg">
                        <img src={cover} alt="" />
                    </div>
                    <div className="profile__settings__content row justify-content-center">
                        <div className="left__settings__content col-lg-4">
                            <div className="change__img__box">
                                <div className="profile__image__box">
                                    <img src={profile} alt="profile" />
                                </div>
                                <div className="camera__icon">
                                    <img src={camerIcon} alt="camera" />
                                </div>
                            </div>
                            <div className="user__name__info">
                                <h3>
                                    Derrick Jackson
                                </h3>
                                <p>
                                    ReachMagnet
                                </p>
                            </div>
                            <div className="view__profile__btn">
                                <button>
                                    View public profile
                                </button>
                            </div>
                        </div>
                        <div className="right__settings__content col-lg-7">
                            <div className="profile__filter__bar">
                                <ProfileFilterBar items={items} onItemClick={handleItemClick}/>
                            </div>
                            <div className="profile__form__inputs mt-3">
                            {activeItem === 'Account Settings' && <MyProfileForm />}
                            {activeItem === 'Password Settings' &&  <UpdatePassword
                                token={token}
                                // setUpdatingData={setUpdatingData}
            />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
