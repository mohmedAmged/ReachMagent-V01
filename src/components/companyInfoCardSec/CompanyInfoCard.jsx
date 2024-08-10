import React, { useEffect, useState } from 'react'
import './companyInfoCard.css'
import verfuIcon from '../../assets/companyImages/Vector (3).png'
import callIcon from '../../assets/companyImages/call.svg'
import messageIcon from '../../assets/companyImages/messages-3.svg'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import { scrollToTop } from '../../functions/scrollToTop';
import Cookies from 'js-cookie';

export default function CompanyInfoCard({ showCompaniesQuery, token }) {
    const loginType = localStorage.getItem('loginType')
    const [currentFollowedCompanies, setCurrentFollowedCompanies] = useState(() => {
        const cookieValue = Cookies.get('CurrentFollowedCompanies');
        return cookieValue ? JSON.parse(cookieValue) : [];
    });
    const navigate = useNavigate();

    const handleToggleFollowCompany = async (id) => {
        const currentCompanyWantedToFollow = {
            company_id: `${id}`
        };
        const toastId = toast.loading('loading...');
        await axios.post(`${baseURL}/${loginType}/control-follow-company?t=${new Date().getTime()}`,
            currentCompanyWantedToFollow,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            .then(response => {
                Cookies.set('CurrentFollowedCompanies', JSON.stringify([...response?.data?.data?.followedCompanies]), { expires: 999999999999999999999999999999 * 99999999999999999999999999999999999 * 99999999999999999999999999999999 });
                setCurrentFollowedCompanies([...response?.data?.data?.followedCompanies]);
                toast.success(`${response?.data?.message}`, {
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(() => {
                toast.error(`Something Went Wrong Please try Again Later!`, {
                    id: toastId,
                    duration: 1000
                });
            });
    };
    console.log(showCompaniesQuery);
    
    return (
        <div className='container'>
            <div className="companyInfoCard__handler">
                <div className="row">
                    <div className="col-lg-3 col-md-12 center__on__mobile">
                        <div className="company__profile__img">
                            <img src={showCompaniesQuery?.companyLogo} alt="profile" />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 ">
                        <div className="company__name">
                            <h1>
                                {showCompaniesQuery?.companyName}
                            </h1>
                            <span>
                                <img src={verfuIcon} alt="icon" />
                            </span>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            Headquarters:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            {showCompaniesQuery?.companyFullAddress}
                                        </p>
                                    </div>
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            Verification Status:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            {showCompaniesQuery?.companyRegisterationStatus}
                                        </p>
                                    </div>
                                    <div className="company__actions">
                                        <button className='btn__companyActions'>
                                            <img src={callIcon} alt="call-icon" />
                                        </button>
                                        <button className='btn__companyActions online__btn'>
                                            <NavLink className={'nav-link'} to={'/your-messages'}>
                                                <img src={messageIcon} alt="message-icon" />
                                                <span className='online__circle'></span>
                                            </NavLink>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            industry:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            {showCompaniesQuery?.companyIndustries[0]?.industryName}
                                        </p>
                                    </div>
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            founded:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            {showCompaniesQuery?.companyFounded}
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            type:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            {showCompaniesQuery?.companyTypes[1]?.type}
                                        </p>
                                    </div>
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            Website:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            <NavLink to={`${showCompaniesQuery?.companyWebsiteLink}`} className='nav-link'>
                                            {showCompaniesQuery?.companyWebsiteLink}
                                            </NavLink>
                                        </p>
                                    </div>
                                    <div className="companyFollow__btn">
                                        {
                                            (token && loginType === 'user') ?
                                                (currentFollowedCompanies) ?
                                                    currentFollowedCompanies?.find(el => +el?.companyId === +showCompaniesQuery?.companyId) ?
                                                        <button
                                                            className='pageMainBtnStyle unFollowCompanyBtn'
                                                            onClick={() => handleToggleFollowCompany(+showCompaniesQuery?.companyId)}
                                                        >
                                                            unFollow
                                                        </button>
                                                        :
                                                        <button
                                                            className='pageMainBtnStyle followCompanyBtn'
                                                            onClick={() => handleToggleFollowCompany(+showCompaniesQuery?.companyId)}
                                                        >
                                                            + follow
                                                        </button>
                                                    : ''
                                                :
                                                <button
                                                    className='pageMainBtnStyle followCompanyBtn'
                                                    onClick={() => {
                                                        toast.error(`${loginType === 'user' ? 'You Should Login First!' : 'Only Users Can Follow Companies!'}`);
                                                        if (loginType === 'user') {
                                                            setTimeout(() => {
                                                                navigate('/login');
                                                                scrollToTop();
                                                            }, 1000);
                                                        };
                                                    }}
                                                >
                                                    + follow
                                                </button>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-12">
                        <div className="companyQutation__btn">
                            {loginType === 'user' &&
                                <NavLink onClick={() => {
                                    scrollToTop();
                                    Cookies.set('currentCompanyRequestedQuote', showCompaniesQuery?.companyId);
                                }}
                                    className='nav-link' to={`/${showCompaniesQuery?.companyName}/request-quote`}>

                                    <button className='btnColoredBlue'>
                                        Request Quotation
                                    </button>

                                </NavLink>
                            }

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
