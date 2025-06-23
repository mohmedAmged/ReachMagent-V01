import React, { useEffect, useState } from 'react'
import './myUsersManagement.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import cover from '../../assets/signUpImages/cover.png'
import ProfileFilterBar from '../../components/profileFilterBarSec/ProfileFilterBar'
import MyAllRoles from '../../components/myAllRolesSec/MyAllRoles'
import Cookies from 'js-cookie';
import MyLoader from '../../components/myLoaderSec/MyLoader'
import PersonalSignUpFormMainSec from '../../components/personalSignUpFormMainSec/PersonalSignUpFormMainSec'
import AllEmployeesSection from '../../components/allEmployeesSection/AllEmployeesSection'
import { GetAllCountriesStore } from '../../store/AllCountries'
import { GetAllCitizenshipsStore } from '../../store/AllCitizenships'
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader'
import { useTranslation } from 'react-i18next'

export default function MyUsersManagement({ token }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
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

    const [activeItem, setActiveItem] = useState('Roles');
    const items = [
        // { name: 'Profiles', active: activeItem === 'Profiles' },
        { name: 'Roles', active: activeItem === 'Roles', rendeName: `${t('DashboardBussinessUserManagementPage.rolesFilterItem')}` },
        { name: 'All Employees', active: activeItem === 'All Employees', rendeName: `${t('DashboardBussinessUserManagementPage.allEmployeesFilterItem')}` },
        { name: 'Add Employee', active: activeItem === 'Add Employee', rendeName: `${t('DashboardBussinessUserManagementPage.addEmployeeFilterItem')}` },
    ];
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };
    // const citizenships = GetAllCitizenshipsStore((state) => state.citizenships);

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
                                        {activeItem === 'Add Employee' && <PersonalSignUpFormMainSec  countries={countries} isSignUp={false} token={token} />}
                                        {activeItem === 'All Employees' && <AllEmployeesSection token={token} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
