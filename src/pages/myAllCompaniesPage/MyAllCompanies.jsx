import React, { useEffect, useState } from 'react'
import './myAllCompanies.css'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import locationIcon from '../../assets/icons/Duotone.png'
import userIcon from '../../assets/icons/Duotone3.png'
import emailIcon from '../../assets/icons/Duotone 2.png'
import flag from '../../assets/icons/image 3 (1).png'
import { NavLink, useParams } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
export default function MyAllCompanies({ token }) {
    const { companyId } = useParams()
    const [newData, setNewdata] = useState([])
    const fetchAllCompanies = async () => {
        try {
            const response = await axios.get(`${baseURL}/all-companies?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.companies);
        } catch (error) {
            setNewdata(error?.response?.data.message);
        }
    };
    useEffect(() => {
        fetchAllCompanies();
    }, [token]);
    console.log(newData);

    return (
        <div className='MyAllCompanies__handler'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-4">
                        <div className="sidebarForItemsFilter__handler">
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationSorting" className='d-flex justify-content-between align-items-center mb-3'>
                                        <span>
                                            Sorting Type
                                        </span>
                                        <i className="bi bi-arrow-down-up"></i>
                                    </label>
                                    <select
                                        id='shopFilterationSorting'
                                        name="sorting"
                                        className="form-control custom-select"
                                        defaultValue={''}
                                        onChange={''}
                                    >
                                        <option value="" disabled>Select Sorting Type</option>
                                        <option value="" >1</option>
                                        <option value="">2</option>
                                        {/* {
                                            sortingTypes?.map(sort => (
                                                <option key={sort?.id} value={sort?.value}>{sort?.name}</option>
                                            ))
                                        } */}
                                    </select>
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationtitle">Filter by Name</label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="shopFilterationtitle"
                                        className="form-control"
                                        placeholder={`Enter your text`}
                                        onChange={''}
                                    />
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationcompany">
                                        Filter by Company
                                    </label>
                                    <select
                                        name="company"
                                        id="shopFilterationcompany"
                                        className="form-control custom-select"
                                        defaultValue={''}
                                        onChange={''}
                                    >
                                        <option value="" disabled>Select a company</option>
                                        <option value="" >1</option>
                                        <option value="">2</option>
                                        {/* {
                                            companiesAllowed?.map(company => (
                                                <option key={company?.id} value={company?.id}>{company?.name}</option>
                                            ))
                                        } */}
                                    </select>
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationcategory">
                                        Filter by Category
                                    </label>
                                    <select
                                        name="category"
                                        id="shopFilterationcategory"
                                        className="form-control custom-select"
                                        defaultValue={''}
                                        onChange={''}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        <option value="" >1</option>
                                        <option value="">2</option>
                                        {/* {
                                            categoriesAllowed?.map(cat => (
                                                <option key={cat?.id} value={cat?.id}>{cat?.name}</option>
                                            ))
                                        } */}
                                    </select>
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationsub-category">
                                        Filter by Sub-Category
                                    </label>
                                    <select
                                        name="sub_category"
                                        id="shopFilterationsub-category"
                                        className="form-control custom-select"
                                        value={''}
                                        onChange={''}
                                    >
                                        <option value="" disabled>Select Sub-Category</option>
                                        <option value="" >1</option>
                                        <option value="">2</option>
                                        {/* {
                                            subCategoriesAllowed?.map(sub => (
                                                <option key={sub?.id} value={sub?.id}>{sub?.name}</option>
                                            ))
                                        } */}
                                    </select>
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <button className='clearFilterBtn'

                                // onClick={() => {
                                //     setFilterationObj({
                                //         company: '',
                                //         title: '',
                                //         sorting: '',
                                //         category: '',
                                //         sub_category: '',
                                //         price_from: '',
                                //         price_to: ''
                                //     });
                                //     scrollToTop(500);
                                // }}

                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-8">
                        <div className="mainContentAllCompanies__handler">
                            <div className="row gap-3">
                                {
                                    newData?.map((el) => {
                                        return (
                                            <div key={el?.id} className="col-12">
                                                <div className="CompanyContentItem">
                                                    <div className="compImage">
                                                        <img src={el?.companyLogo} alt={el?.companyName} />
                                                    </div>
                                                    <div className="compMainInfo">
                                                        <h5 className='mb-2'>
                                                            {el?.companyName}
                                                        </h5>
                                                        <div className="companySubInfo mb-2">
                                                            <div className="subInfoItem">
                                                                <img src={userIcon} alt="locateion-icon" />
                                                                <span>
                                                                    E-Commerce
                                                                </span>
                                                            </div>
                                                            <div className="subInfoItem">
                                                                <img src={locationIcon} alt="locateion-icon" />
                                                                <span>
                                                                    Jordon
                                                                </span>
                                                            </div>
                                                            <div className="subInfoItem">
                                                                <img src={emailIcon} alt="locateion-icon" />

                                                                <NavLink to={el?.companyWebsiteLink}>
                                                                    <span>
                                                                        Website
                                                                    </span>
                                                                </NavLink>

                                                            </div>
                                                        </div>
                                                        <div className="companyDescrip mb-2">
                                                            <p>
                                                                {el?.companyAboutUs}
                                                            </p>
                                                        </div>
                                                        <div className="companyMainCountry">
                                                            <img src={flag} alt="flag" />
                                                            <span>
                                                                Saudi Arabia
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="companyActions">
                                                        <NavLink onClick={() => {
                                                            scrollToTop();
                                                        }} className={'nav-link'} to={`/show-company/${el?.companyId}`}>
                                                            <button className='pageMainBtnStyle'>
                                                                more info
                                                            </button>
                                                        </NavLink>
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
