import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import { scrollToTop } from '../../functions/scrollToTop';
import { NavLink } from 'react-router-dom';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import './myPosts.css'
export default function MyPosts({ token }) {
    const loginType = localStorage.getItem('loginType')
    const [newData, setNewdata] = useState([])

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-posts?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.posts);
        } catch (error) {
            setNewdata(error?.response?.data.message);
        }
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
            // Optionally update the state to remove the deleted item from the UI
            await fetchPosts()
            // setNewdata(newData?.filter(item => item?.id !== id));
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };
    console.log(newData);

    return (
        <>
            <div className='dashboard__handler postsInDash__handler d-flex'>
                <MyNewSidebarDash />
                <div className='main__content container'>
                    <MainContentHeader />
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
                                                                    <img src={el.companyLogo}alt="newImg" />
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
                </div>
            </div>

        </>
    )
}
