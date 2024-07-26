import React, { useState } from 'react'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import cover from '../../assets/signUpImages/cover2.png'
import profile2 from '../../assets/signUpImages/profile2.png'
import camerIcon from '../../assets/signUpImages/camera-icon.png'
import ProfileFilterBar from '../../components/profileFilterBarSec/ProfileFilterBar'
import MyProfileForm from '../../components/myProfileFormSec/MyProfileForm'
import UpdatePassword from '../../components/updatePasswordSec/UpdatePassword'
export default function MyBussinessSettings({token, }) {
    const [activeItem, setActiveItem] = useState('Account Settings');
    const items = [
        { name: 'Company Settings', active: activeItem === 'Company Settings' },
        { name: 'Documents', active: activeItem === 'Documents' },
        { name: 'Billing', active: activeItem === 'Billing' },
        { name: 'Notifications', active: activeItem === 'Notifications' },
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
                                    <img src={profile2} alt="profile" />
                                </div>
                                <div className="camera__icon">
                                    <img src={camerIcon} alt="camera" />
                                </div>
                            </div>
                            <div className="user__name__info">
                                <h3>
                                    Reach Magnet
                                </h3>
                                <p>
                                    ReachMagnet
                                </p>
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
                                {activeItem === 'Company Settings' && <MyProfileForm />}
                                {/* {activeItem === 'Documents' &&  <UpdatePassword
                                token={token}
                                // setUpdatingData={setUpdatingData}
                                />} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
