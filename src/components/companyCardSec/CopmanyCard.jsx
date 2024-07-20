import React, { useEffect, useState } from 'react'
import './companyCard.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { scrollToTop } from '../../functions/scrollToTop';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
export default function CopmanyCard({ token , coverImg, companyProfile, companyName, companyUser, productsCount, dealsCount, ownerCount, cardDesc, companyId }) {
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
                    companyId: `${companyId}`,
                    companyName,
                    companyLogo: companyProfile,
                }]);
                toast.success(`${response?.data?.data?.message}`,{
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(errors =>{
                toast.error(`${errors?.response?.data?.message}`,{
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
                toast.error(`${errors?.response?.data?.message}`,{
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
    console.log(currentFollowedCompanies)
    return (
        <div className='companyCard__item'>
            <div className="card__cover">
                <img src={coverImg} alt="cover" />
            </div>
            <div className="card__content">
                <div className="card__info">
                    <div className="company__profile">
                        <img src={companyProfile} alt="profile" />
                    </div>
                    <div className="company__name">
                        <h2>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }} to={`/show-company/${companyId}`} className={'nav-link'}>
                                {companyName}
                            </NavLink>
                        </h2>
                    </div>
                    <div className="company__user">
                        <h5>
                            {companyUser}
                        </h5>
                    </div>
                    <div className="company__data">
                        <div className="company__products compDataStyle">
                            <h3>
                                {productsCount}
                            </h3>
                            <p>
                                products
                            </p>
                        </div>
                        <div className="company__deals compDataStyle">
                            <h3>
                                {dealsCount}
                            </h3>
                            <p>
                                deals
                            </p>
                        </div>
                        <div className="company__owner compDataStyle">
                            <h3>
                                {ownerCount}
                            </h3>
                            <p>
                                owners
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card__actions">
                    {
                        (token && loginType === 'user') ? 
                            (!(currentFollowedCompanies === undefined) && !(currentFollowedCompanies.length === 0)) ?
                            currentFollowedCompanies?.find(el=> +el?.companyId === +companyId) ?
                                <button 
                                    className='pageMainBtnStyle unFollowCompanyBtn'
                                    onClick={()=> handleUnFollowCompany(companyId)}
                                >
                                    unFollow
                                </button>
                                :
                                <button 
                                    className='pageMainBtnStyle followCompanyBtn'
                                    onClick={() => handleFollowCompany(companyId)}
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
            <div className="card__description">
                <p>
                    {cardDesc}
                </p>
            </div>
        </div>
    )
}
