import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import { scrollToTop } from '../../functions/scrollToTop';
import { NavLink } from 'react-router-dom';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import './myPosts.css';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';

export default function MyPosts({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [newData, setNewdata] = useState([]);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        };
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-posts?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.posts);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
        };
    };

    useEffect(() => {
        fetchPosts();
    }, [loginType, token]);

    const handleDeleteThispost = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-post/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchPosts();
        } catch (error) {
            toast.error(error?.response?.data?.message);
        };
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler postsInDash__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={'Posts'} />
                                        <div className="content__card__list">
                                            {
                                                newData?.length !== 0 ?
                                                    <div className="row gap-4">
                                                        {
                                                            newData?.map((el) => {
                                                                return (
                                                                    <div className='col-lg-5 col-md-5 col-sm-12 postItemBg'>
                                                                        <div className="headOfNews__card d-flex justify-content-between align-items-start">
                                                                            <div className="headOfNews__card-leftPart">
                                                                                <div className="image">
                                                                                    <img src={el.companyLogo} alt="newImg" />
                                                                                </div>
                                                                                <h4>{el.postTitle}</h4>
                                                                                <p>Type: {el.postType}</p>
                                                                                <p>{el.postDate}

                                                                                </p>
                                                                            </div>
                                                                            <div className="headOfNews__card-rightPart">
                                                                                <i onClick={() => handleDeleteThispost(el?.postId)} className="bi bi-trash"></i>
                                                                            </div>
                                                                        </div>
                                                                        <div className="news__card-body">
                                                                            <p>
                                                                                {
                                                                                    el.postDescription
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    :
                                                    <div className='row'>
                                                        <div className="col-12 text-danger fs-5">
                                                            No Posts Yet
                                                        </div>
                                                    </div>
                                            }

                                        </div>
                                        <div className='addNewItem__btn'>
                                            <NavLink
                                                onClick={() => {
                                                    scrollToTop();
                                                }}
                                                to='/profile/posts/addNewItem' className='nav-link'>
                                                <button >
                                                    Add New Post
                                                </button>
                                            </NavLink>

                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </>
    );
};
