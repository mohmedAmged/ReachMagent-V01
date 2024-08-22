import React, { useEffect, useRef, useState } from 'react'
import './myAllCompanies.css'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import locationIcon from '../../assets/icons/Duotone.png'
import userIcon from '../../assets/icons/Duotone3.png'
import emailIcon from '../../assets/icons/Duotone 2.png'
import flag from '../../assets/icons/image 3 (1).png'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
export default function MyAllCompanies({ token }) {
    const [allCompanies, setAllCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [uniqueAllowedCompNames, setUniqueAllowedCompNames] = useState([]);
    const [uniqueAllowedCompTypes, setUniqueAllowedCompTypes] = useState([]);
    // const [newData, setNewdata] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        main_type: [],
        product_name: '',
        service_name: '',
    });
    const location = useLocation();
    const navigate = useNavigate();
    const initialized = useRef(false);
    // ?t=${new Date().getTime()}
    const fetchAllCompanies = async () => {
        try {
            const response = await axios.get(`${baseURL}/all-companies?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const companies = response?.data?.data?.companies || [];
            setAllCompanies(companies);

            // Extract unique company names and types
            const companyAllowedNames = companies.map(item => item.companyName);
            const companyAllowedTypes = companies.flatMap(item => item.companyTypes.map(typeObj => typeObj.type));
            setUniqueAllowedCompNames([...new Set(companyAllowedNames)]);
            setUniqueAllowedCompTypes([...new Set(companyAllowedTypes)]);
        } catch (error) {
            console.error("Error fetching all companies:", error);
        }
    };
    // Fetch filtered companies based on form data
    const fetchFilteredCompanies = async () => {
        try {
            const queryString = buildQueryString(formData);
            const response = await axios.get(`${baseURL}/filter-companies?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const companies = response?.data?.data?.companies || [];
            setFilteredCompanies(companies);
        } catch (error) {
            console.error("Error fetching filtered companies:", error);
            setFilteredCompanies([]);
        }
    };

    const buildQueryString = (params) => {
        const query = new URLSearchParams();
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach(item => query.append(`${key}[]`, item));
            } else if (value) {
                query.append(key, value);
            }
        });
        return query.toString();
    };
    // Update URL with the current filters
    const updateURLWithFilters = () => {
        const queryString = buildQueryString(formData);
        navigate(`?${queryString}`, { replace: true });
    };
    // Initialize formData from URL query parameters
    useEffect(() => {
        if (!initialized.current) {
            const queryParams = new URLSearchParams(location.search);
            const initialFormData = {
                name: queryParams.get('name') || '',
                main_type: queryParams.getAll('main_type[]') || [],
                product_name: queryParams.get('product_name') || '',
                service_name: queryParams.get('service_name') || '',
            };
            setFormData(initialFormData);
            initialized.current = true;
        }
    }, [location.search]);

    useEffect(() => {
        fetchAllCompanies();
    }, [token]);

    // Re-fetch companies when filter
    useEffect(() => {
        if (allCompanies.length > 0) {
            fetchFilteredCompanies();
            updateURLWithFilters();
        }
    }, [formData, allCompanies]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value ? [value] : [],
        }));
    };

    const clearFilters = () => {
        setFormData({
            name: '',
            main_type: [],
            product_name: '',
            service_name: '',
        });
        navigate('?');
    };

    return (
        <div className='MyAllCompanies__handler'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-4">
                        <div className="sidebarForItemsFilter__handler">
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationtitle">Filter by Product</label>
                                    <input
                                        type="text"
                                        name="product_name"
                                        id="shopFilterationtitle"
                                        className="form-control"
                                        placeholder={`Enter your text`}
                                        value={formData?.product_name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationtitle">Filter by Service</label>
                                    <input
                                        type="text"
                                        name="service_name"
                                        id="shopFilterationtitle"
                                        className="form-control"
                                        placeholder={`Enter your text`}
                                        value={formData?.service_name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationcompany">
                                        Filter by Company
                                    </label>
                                    <select
                                        name="name"
                                        id="shopFilterationcompany"
                                        className="form-control custom-select"
                                        // defaultValue={''}
                                        value={formData?.name}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>Select a company</option>
                                        {
                                            uniqueAllowedCompNames?.map((company, index) => (
                                                <option key={index} value={company}>{company}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="sidebarItemFilter">
                                <div className="catalog__new__input">
                                    <label htmlFor="shopFilterationSorting">
                                        <span>
                                            filter by Company Types
                                        </span>
                                    </label>
                                    <select
                                        id='shopFilterationSorting'
                                        name="main_type"
                                        className="form-control custom-select"
                                        // defaultValue={''}
                                        value={formData.main_type[0] || ''}
                                        onChange={handleSelectChange}
                                    >
                                        <option value="" disabled>Select Sorting Type</option>
                                        {
                                            uniqueAllowedCompTypes?.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>


                            {/* <div className="sidebarItemFilter">
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
                                    </select>
                                </div>
                            </div> */}

                            {/* <div className="sidebarItemFilter">
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
                                    </select>
                                </div>
                            </div> */}


                            <div className="sidebarItemFilter">
                                <button
                                    className='clearFilterBtn'
                                    onClick={clearFilters}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-8">
                        <div className="mainContentAllCompanies__handler">
                            {
                                filteredCompanies?.length !== 0 ?
                                <div className="row gap-3">
                                {
                                    filteredCompanies?.map((el) => {
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
                            :
                            <div className="row">
                                <div className="col-12">
                                    <h1 className=' text-danger fs-3 text-capitalize text-center mt-4'>
                                        no company with this filter
                                    </h1>
                                </div>
                            </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
