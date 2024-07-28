import React, { useState } from 'react'
import './myUsersManagement.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import cover from '../../assets/signUpImages/cover.png'
import ProfileFilterBar from '../../components/profileFilterBarSec/ProfileFilterBar'
import MyAllRoles from '../../components/myAllRolesSec/MyAllRoles'

export default function MyUsersManagement() {
    const [activeItem, setActiveItem] = useState('Roles');
    const items = [
        { name: 'Profiles', active: activeItem === 'Profiles' },
        { name: 'Roles', active: activeItem === 'Roles' },
        { name: 'Invitations', active: activeItem === 'Invitations' },
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
                <div className="profileCoverImg">
                    <img src={cover} alt="" />
                </div>
                <div className="content__view__handler content__box__shadow">
                    <div className="user__management__content row justify-content-center">
                        <div className="col-12 profile__filter__bar">
                            <ProfileFilterBar items={items} onItemClick={handleItemClick} />
                        </div>
                        <div className="col-12 user__management__main__info mt-3">
                        {activeItem === 'Roles' && <MyAllRoles />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
