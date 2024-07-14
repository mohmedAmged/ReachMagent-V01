import React, { useEffect, useState } from 'react'
import './companyFollowers.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function CompanyFollowers({ loginType, token}) {
    const [followers,setFollowers] = useState([]);
    const [currentUserLogin,setCurrentUserLogin] = useState(null);
    
    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'),currentUserLogin]);

    useEffect(() => {
        if (token) {
            const slugCompletion = loginType === 'user' ? 'user//my-followed-companies' : 'employee/followers';
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${baseURL}/${slugCompletion}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setFollowers(response?.data?.data?.followers);
                } catch (error) {
                    toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
                };
            };
            fetchData();
        };
    }, []);


    return (
        <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
                <MainContentHeader currentUserLogin={currentUserLogin} />
                <div className='content__view__handler company__follower__sec'>
                    <ContentViewHeader title={'All Followers'} />
                    <div className="follower__filter__search">
                        <div className="row">
                            <div className="col-12">
                                <div className="form__part input__search__part">
                                    <i className="bi bi-search"></i>
                                    <input type="text" placeholder='Search followers...' />
                                </div>
                            </div>
                        </div>
                        <div className='followerInfo__handler row'>
                            {
                                followers?.map((el) => {
                                    return (
                                        <div key={el?.followerId} className="followerInfo__Item col-12">
                                            <div className="followerImage">
                                                <img src={el?.followerImg} alt={`${el?.followerName} avatar`} />
                                            </div>
                                            <div className="followerContactInfo">
                                                <h1>
                                                    {el?.followerName}
                                                </h1>
                                                <div className="follower__status">
                                                    <p>
                                                        {el?.followerEmail}
                                                    </p>
                                                    <p className='isUsersfollowed'>
                                                        follows you
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};