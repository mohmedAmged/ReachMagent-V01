import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import { scrollToTop } from '../../functions/scrollToTop';
import { NavLink } from 'react-router-dom';

export default function MyCompaniesInsights({ token }) {
    const [newData, setNewdata] = useState([])
    const fetchAllPosts = async () => {
        try {
            const response = await axios.get(`${baseURL}/all-posts?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.posts);
        } catch (error) {
            setNewdata(error?.response?.data?.message);
        }
    };
    useEffect(() => {
        fetchAllPosts();
    }, [token]);
    console.log(newData);

    return (
        <div className='myCompaniesInsights__handler'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-4">
                        <div className="sidebarForItemsFilter__handler">
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationcompany">
                                        Filter by Company
                                    </label>
                                    <select
                                        name="name"
                                        id="shopFilterationcompany"
                                        className="form-control custom-select"
                                    // value={formData?.name}
                                    // onChange={handleInputChange}
                                    >
                                        <option value="" disabled>Select a company</option>
                                        {/* {
                                            uniqueAllowedCompNames?.map((company, index) => (
                                                <option key={index} value={company}>{company}</option>
                                            ))
                                        } */}
                                    </select>
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationcategory">
                                        Filter by type
                                    </label>
                                    <select
                                        name="category_id"
                                        id="shopFilterationcategory"
                                        className="form-control custom-select"
                                    // value={formData?.category_id}
                                    // onChange={handleCategoryChange}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {/* {
                                            categories?.map((category, index) => (
                                                <option key={index} value={category.categoryId}>{category.categoryName}</option>
                                            ))
                                        } */}
                                    </select>
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <button
                                    className='clearFilterBtn'
                                // onClick={clearFilters}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-8 ">
                        <div className="allContentPosts__handler">
                            <div className="row">
                                {
                                    newData?.map((el) => {
                                        return (
                        <div key={el?.id} className="col-lg-6 d-flex justify-content-center mb-3">
                            <div className="news__card p-3">
                                <div className="headOfNews__card d-flex justify-content-between align-items-start">
                                    <div className="headOfNews__card-leftPart">
                                        <div className="image">
                                            <NavLink
                                                onClick={() => {
                                                    scrollToTop();
                                                }}
                                                className={'nav-link'} to={`/show-company/${el?.company_id}`}>
                                                <img src={el?.company_logo} alt="newImg" />
                                            </NavLink>
                                        </div>
                                        <h4>{el?.title}</h4>
                                        <p>Type: {el?.type}</p>
                                        <p>{el?.created_at}</p>
                                    </div>
                                </div>
                                <div className="news__card-body">
                                    <p>
                                        {
                                            el?.description
                                        }
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
        </div>
    )
}
