import React, { useEffect, useState } from 'react'
import './myUsersManagement.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import cover from '../../assets/signUpImages/cover.png'
import ProfileFilterBar from '../../components/profileFilterBarSec/ProfileFilterBar'
import MyAllRoles from '../../components/myAllRolesSec/MyAllRoles'
import Cookies from 'js-cookie';

export default function MyUsersManagement({token}) {
    const [currentUserLogin,setCurrentUserLogin] = useState(null);

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

    const [activeItem, setActiveItem] = useState('Roles');
    const items = [
        { name: 'Profiles', active: activeItem === 'Profiles' },
        { name: 'Roles', active: activeItem === 'Roles' },
        { name: 'Invitations', active: activeItem === 'Invitations' },
    ];
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    return (
        <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
                <MainContentHeader currentUserLogin={currentUserLogin} />
                <div className="profileCoverImg">
                    <img src={cover} alt="" />
                </div>
                <div className="content__view__handler content__box__shadow">
                    <div className="user__management__content row justify-content-center">
                        <div className="col-12 profile__filter__bar">
                            <ProfileFilterBar items={items} onItemClick={handleItemClick} />
                        </div>
                        <div className="col-12 user__management__main__info mt-3">
                        {activeItem === 'Roles' && <MyAllRoles token={token} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
