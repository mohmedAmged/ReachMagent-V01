import React, { useEffect, useState } from 'react'
import './companyInfoCard.css'
import verfuIcon from '../../assets/companyImages/Vector (3).png'
import callIcon from '../../assets/companyImages/call.svg'
import messageIcon from '../../assets/companyImages/messages-3.svg'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import { scrollToTop } from '../../functions/scrollToTop'
export default function CompanyInfoCard({ showCompaniesQuery ,token }) {
    const loginType = localStorage.getItem('loginType');
    const [currentFollowedCompanies,setCurrentFollowedCompanies] = useState([]);
    const navigate = useNavigate();

    const handleFollowCompany = async (id) => {
        const currentCompanyWantedToFollow = {
            company_id: `${id}`
        };
        const toastId = toast.loading('loading...');
            await axios.post(`${baseURL}/${loginType}/follow-company`, 
            currentCompanyWantedToFollow ,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${token}`
                },
            })
            .then(response => {
                setCurrentFollowedCompanies([...currentFollowedCompanies,{
                    companyId: `${+id}`,
                    companyName: showCompaniesQuery?.name,
                    companyLogo: showCompaniesQuery?.logo,
                }]);
                toast.success(`${response?.data?.data?.message}`,{
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(errors =>{
                toast.error(`${errors?.response?.data?.errors?.company_id || errors?.response?.data?.message}`,{
                    id: toastId,
                    duration: 1000
                });
            });
    };

    const handleUnFollowCompany = async (id) => {
        const currentFollowId = currentFollowedCompanies?.find(el=> +el?.companyId === +id)?.id;
        const currentCompanyWantedToFollow = {
            follow_id: `${currentFollowId}`
        };
        const toastId = toast.loading('loading...');
            await axios.post(`${baseURL}/${loginType}/unfollow-company`, 
            currentCompanyWantedToFollow ,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${token}`
                },
            })
            .then(response => {
                setCurrentFollowedCompanies(currentFollowedCompanies.filter(el=> +el?.companyId === +id));
                toast.success(`${response?.data?.message}`,{
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(errors =>{
                toast.error(`${errors?.response?.data?.errors?.follow_id || errors?.response?.data?.message}`,{
                    id: toastId,
                    duration: 1000
                });
            });
    };

    // getting Current followed Companies
    useEffect(() => {
        if(token && loginType === 'user'){
            (async () => {
                const {data} = await axios.get(`${baseURL}/${loginType}/my-followed-companies`,{
                    headers: {
                        Authorization : `Bearer ${token}`
                    },
                });
                setCurrentFollowedCompanies(data?.data?.followedCompanies);
            })();
        };
    },[loginType, token]);

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
                                            2019
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
                                            <NavLink to={'https://www.homzmart.com/'} className='nav-link'>
                                                https://www.homzmart.com/
                                            </NavLink>
                                        </p>
                                    </div>
                                    <div className="companyFollow__btn">
                                    {
                                        (token && loginType === 'user') ?
                                            !(currentFollowedCompanies === undefined && currentFollowedCompanies.length === 0) ? 
                                                currentFollowedCompanies?.find(el=> +el?.companyId === +showCompaniesQuery?.companyId) ?
                                                <button 
                                                    className='pageMainBtnStyle unFollowCompanyBtn'
                                                    onClick={()=> handleUnFollowCompany(+showCompaniesQuery?.companyId)}
                                                >
                                                    unFollow
                                                </button>
                                                :
                                                <button 
                                                    className='pageMainBtnStyle followCompanyBtn'
                                                    onClick={() => handleFollowCompany(+showCompaniesQuery?.companyId)}
                                                >
                                                    + follow
                                                </button>
                                            : ''
                                        : 
                                        <button 
                                            className='pageMainBtnStyle followCompanyBtn'
                                            onClick={()=> {
                                                toast.error(`${loginType === 'user' ? 'You Should Login First!' : 'Only Users Can Follow Companies!'}`);
                                                if(loginType === 'user'){
                                                    setTimeout(()=>{
                                                        navigate('/login');
                                                        scrollToTop();
                                                    },1000);
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
                            <button className='btnColoredBlue'>
                                Request Quotation
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
