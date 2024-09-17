import React, { useEffect, useState } from 'react'
import './companyFollowers.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import MyLoader from '../../components/myLoaderSec/MyLoader'
import UnAuthSec from '../../components/unAuthSection/UnAuthSec'

export default function CompanyFollowers({ loginType, token }) {
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    useEffect(() => {
        if (token) {
            const slugCompletion = loginType === 'user' ? 'user/my-followed-companies' : 'employee/followers';
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${baseURL}/${slugCompletion}?page=${currentPage}?t=${new Date().getTime()}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (loginType === 'user') {
                        setFollowers(response?.data?.data?.followedCompanies);
                    } else if (loginType === 'employee') {
                        setFollowers(response?.data?.data?.followers);
                    };
                    setTotalPages(response?.data?.data?.meta?.last_page);
                } catch (error) {
                    if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                        setUnAuth(true);
                    };
                    toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
                };
            };
            fetchData();
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    const updatedFollowersAndFollowing = loginType === 'user'
        ?
        followers?.filter((el, index, self) =>
            index === self.findIndex((t) => t.companyId === el.companyId)
        )
        :
        followers?.filter((el, index, self) =>
            index === self.findIndex((t) => t.userId === el.userId)
        )
    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler company__follower__sec'>
                                        <ContentViewHeader title={`${loginType === 'user' ? 'All Following' : 'All Followers'}`} />
                                        <div className="follower__filter__search">
                                            <div className='followerInfo__handler row'>
                                                {
                                                    updatedFollowersAndFollowing?.map((el) => {
                                                        return (
                                                            <div key={el?.id} className="followerInfo__Item col-12">
                                                                <div className="followerImage">
                                                                    <img src={el?.userImage || el?.companyLogo
                                                                    } alt={`${el?.userName || el?.companyLogo} avatar`} />
                                                                </div>
                                                                <div className="followerContactInfo">
                                                                    <h1>
                                                                        {el?.userName || el?.companyName}
                                                                    </h1>
                                                                    <div className="follower__status">
                                                                        <p>
                                                                            {el?.userEmail || ''}
                                                                        </p>
                                                                        <p className='isUsersfollowed'>
                                                                            {
                                                                                loginType === 'user' ?
                                                                                    <>
                                                                                        following
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        follows you
                                                                                    </>
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <div className="col-lg-12">
                                                    {
                                                        totalPages > 1 &&
                                                        <div className="d-flex justify-content-center align-items-center mt-4">
                                                            <button
                                                                type="button"
                                                                className="paginationBtn me-2"
                                                                disabled={currentPage === 1}
                                                                onClick={() => handlePageChange(currentPage - 1)}
                                                            >
                                                                <i class="bi bi-caret-left-fill"></i>
                                                            </button>
                                                            <span className='currentPagePagination'>{currentPage}</span>
                                                            <button
                                                                type="button"
                                                                className="paginationBtn ms-2"
                                                                disabled={currentPage === totalPages}
                                                                onClick={() => handlePageChange(currentPage + 1)}
                                                            >
                                                                <i class="bi bi-caret-right-fill"></i>
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </>
    );
};