import React, { useEffect, useState } from 'react'
import { scrollToTop } from '../../functions/scrollToTop';
import locationIcon from "../../assets/icons/Duotone.png";
import userIcon from "../../assets/icons/Duotone3.png";
import emailIcon from "../../assets/icons/Duotone 2.png";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './mainGeneralSearchHome.css'
import MyLoader from '../myLoaderSec/MyLoader';
import { GetAllCountriesStore } from '../../store/AllCountries';
import { SearchStore } from '../../store/MainSearch';
import LastMinuteCard from '../lastMinuteCardSec/LastMinuteCard';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function SearchInHome() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const { search } = useLocation();
    // const [currentData, setCurrentData] = useState([]);
    const [filteration, setFilteration] = useState({
        type: '',       /*catalog || service || company*/
        country_id: '',
        name: ''
    });
    const navigate = useNavigate();
    const currCategWantedToFilterFor = [{
        id: 1,
        name: 'companies'
    }];

    const getAllAllowedCountries = GetAllCountriesStore((state) => state.getAllAllowedCountries);
    useEffect(() => { getAllAllowedCountries() }, [getAllAllowedCountries]);
    const allowedCountries = GetAllCountriesStore((state) => state.allowedCountries);
    const { currentData, pagination, getCurrentSearchedData, appendData } = SearchStore();

    useEffect(() => {
        const queryParams = new URLSearchParams(search);
        const filters = {
            type: queryParams.get('type') || '',
            country_id: queryParams.get('country_id') || '',
            name: queryParams.get('name') || ''
        };
        setFilteration(filters);
        getCurrentSearchedData(search); // Load data with query params
    }, [search, getCurrentSearchedData]);

    // useEffect(() => {
    //     getCurrentSearchedData(search);
    // }, [search, getCurrentSearchedData]);

    function objectToParams(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== '') {
                params.append(key, obj[key]);
            };
        };
        return params.toString();
    };

    const clearFilteration = () => {
        setFilteration({
            type: '',
            country_id: '',
            name: ''
        });
        navigate('/reach-magnet')
    };

    const handleChange = (e) => {
        setFilteration({ ...filteration, [e.target?.name]: e.target.value });
    };

    useEffect(() => {
        const query = objectToParams(filteration);
        if (query) {
            navigate(`/reach-magnet?${query}`);
        }
    }, [filteration]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    console.log(currentData);

    // const loadMoreData = (type) => {
    //     const nextPage = pagination[type]?.current_page + 1;

    //     if (nextPage <= pagination[type]?.last_page) {
    //         getCurrentSearchedData(`${search}&page=${nextPage}`).then((newData) => {
    //             // Safely merge the existing data with new data
    //             const updatedData = { ...currentData };

    //             if (type === 'company') {
    //                 updatedData.companies = [
    //                     ...(currentData.companies || []),
    //                     ...(newData.companies || []),
    //                 ];
    //             } else if (type === 'catalog') {
    //                 updatedData.catalogs = [
    //                     ...(currentData.catalogs || []),
    //                     ...(newData.catalogs || []),
    //                 ];
    //             } else if (type === 'service') {
    //                 updatedData.services = [
    //                     ...(currentData.services || []),
    //                     ...(newData.services || []),
    //                 ];
    //             }

    //             // Update the store or local state with the merged data
    //             SearchStore.setState({ currentData: updatedData });
    //         });
    //     }
    // };
    const loadMoreData = (type) => {
        const nextPage = pagination[type]?.current_page + 1;
        if (nextPage <= pagination[type]?.last_page) {
            appendData(`${search}&page=${nextPage}`, type);
        }
    };
    return (
        <>
            {
                loading ?
                    <MyNewLoader />
                    :
                    <div className="MyAllCompanies__handler">
                        <div className="container">
                            <div className="row">
                                <h1 className="col-12 mb-5">
                                    {t('GeneralSearchPage.generalSearchHead')}
                                </h1>
                                <div className="col-lg-3 col-md-4">
                                    <div className="sidebarForItemsFilter__handler">
                                        <div className="sidebarItemFilter">
                                            <div className="catalog__new__input">
                                                <label htmlFor="shopFilterationtitle">
                                                    {t('GeneralSearchPage.generalSearchFilterForLabel')}
                                                    
                                                </label>
                                                <select
                                                    name="type"
                                                    id="shopFilterationtitle"
                                                    className={`form-select ${Lang === 'ar' ? "formSelect_RTL" : ""}`}
                                                    value={filteration.type}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">{t('GeneralSearchPage.generalSearchFilterForAll')}</option>
                                                    <option value="company">{t('GeneralSearchPage.generalSearchFilterForCompanies')}</option>
                                                    <option value="catalog">{t('GeneralSearchPage.generalSearchFilterForProducts')}</option>
                                                    <option value="service">{t('GeneralSearchPage.generalSearchFilterForServices')}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="sidebarItemFilter">
                                            <div className="catalog__new__input">
                                                <label htmlFor="shopFilterationServ">
                                                   {t('GeneralSearchPage.generalSearchFilterByNameLabel')}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="shopFilterationServ"
                                                    className="form-control"
                                                    placeholder={t('GeneralSearchPage.generalSearchFilterByNamePlaceholder')}
                                                    value={filteration?.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="sidebarItemFilter">
                                            <div className="catalog__new__input">
                                                <label htmlFor="shopFilterationServ">
                                                    {t('GeneralSearchPage.generalSearchFilterByCountryLabel')}
                                                </label>
                                                <select
                                                    name="country_id"
                                                    id="shopFilterationServ"
                                                    className={`form-select ${Lang === 'ar' ? "formSelect_RTL" : ""}`}
                                                    value={filteration?.country_id}
                                                    onChange={handleChange}
                                                >
                                                    <option value="" disabled>{t('GeneralSearchPage.generalSearchFilterByCountryPlaceholder')}</option>
                                                    {
                                                        allowedCountries?.map(country => (
                                                            <option key={country?.id} value={country?.id}>{country?.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="sidebarItemFilter">
                                            <button className="clearFilterBtn" onClick={clearFilteration}>
                                                {t('GeneralSearchPage.generalSearchClearBtn')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9 col-md-8">
                                    {
                                        currentData?.companies?.length === 0 && currentData?.catalogs?.length === 0 && currentData?.services?.length === 0 ?
                                            (
                                                <h3 className='text-danger text-capitalize text-center'>{t('GeneralSearchPage.generalSearchNoData')}</h3>
                                            )
                                            :
        <div className="mainContentAllCompanies__handler">
            {currentData?.companies?.length !== 0 &&
                (
                    <div className="row gap-3">
                        <h2>
                            {t('GeneralSearchPage.generalSearchFilterForCompanies')}
                        </h2>
                        {
                            currentData?.companies?.map((el) => {
                                return (
                                    <div key={el?.companyId} className="col-12">
                                        <div className="CompanyContentItem">
                                            <div className="compImage">
                                                <NavLink to={`/${el?.companySlug}`} target="_blank" className={'nav-link'}>
                                                    <img
                                                        src={el?.companyLogo}
                                                        alt={el?.companyName}
                                                    />
                                                </NavLink>
                                            </div>
                                            <div className="compMainInfo">
                                                <h5 className="mb-2">
                                                    <NavLink to={`/${el?.companySlug}`} target="_blank" className={'nav-link'}>
                                                        {el?.companyName}
                                                    </NavLink>
                                                </h5>
                                                <div className="companySubInfo mb-2">
                                                    <div className="subInfoItem">
                                                        <img src={userIcon} alt="locateion-icon" />
                                                        {/* <span>{el?.companyIndustries[0]?.industryName || 'N/A'}</span> */}
                                                        {
                                                        el?.companyIndustries?.length > 0 ? (
                                                            <span>{el.companyIndustries.map(i => i?.industryName).join(', ')}</span>
                                                        ) : (
                                                            <span>{el?.companyCategory || 'Not specified'}</span>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="subInfoItem">
                                                        <img
                                                            src={locationIcon}
                                                            alt="locateion-icon"
                                                        />
                                                        <span>
                                                            {el?.companyBranches[0]?.branchCity || 'N/A'}
                                                        </span>
                                                    </div>
                                                    {/* <div className="subInfoItem">
                                        <img src={emailIcon} alt="locateion-icon" />

                                        <NavLink to={el?.companyWebsiteLink}>
                                            <span>Website</span>
                                        </NavLink>
                                    </div> */}
                                                </div>
                                                <div className="companyDescrip mb-2">
                                                    <p className="cursorPointer" title={el?.companyAboutUs}>
                                                        {el?.companyAboutUs?.length > 200
                                                            ? `${el?.companyAboutUs?.slice(0, 200)}...`
                                                            : el?.companyAboutUs}
                                                    </p>
                                                </div>
                                                <div className="companyMainCountry">
                                                    {/* <img src={flag} alt="flag" /> */}
                                                    <i className="bi bi-crosshair2"></i>
                                                    <span>
                                                        {el?.companyBranches[0]?.branchCountry || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="companyActions">
                                                <NavLink
                                                    onClick={() => {
                                                        scrollToTop();
                                                    }}
                                                    className={"nav-link"}
                                                    to={`/${el?.companySlug}`}
                                                >
                                                    <button className="pageMainBtnStyle">
                                                       {t('GeneralSearchPage.generalSearchMoreInfo')}
                                                    </button>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {pagination.companies?.current_page <
                            pagination.companies?.last_page && (
                                <button className='pageMainBtnStyle py-2' onClick={() => loadMoreData('companies')}>
                                   {t('GeneralSearchPage.generalSearchLoadMorCompany')}
                                </button>
                            )}
                    </div>
                )}
            {
                currentData?.catalogs?.length !== 0 &&
                (
                    <div className="row my-5">
                        <h2>
                            {t('GeneralSearchPage.generalSearchCatalogTit')}
                        </h2>
                        {
                            currentData?.catalogs?.map((cata) => (
                                <div className="col-lg-6 col-md-6 generalSearchCatalogCard my-4">

                                    <LastMinuteCard
                                        productImage={cata?.media[0].image || 'N/A'}
                                        productName={cata?.title}
                                        productLink={`/${cata?.company_slug}/catalog-details/${cata?.slug
                                        }`}
                                        showCustomContent={true}
                                        borderColor={'rgba(0, 0, 0, 0.5)'}
                                        onAddClick={''}
                                        showMoreDetails={true}
                                        productCatgeory={cata?.category}
                                        productCompany={cata?.company_name}
                                        productCompanySlug={cata?.company_slug}
                                    />
                                </div>
                            ))
                        }
                        {pagination.catalogs?.current_page <
                            pagination.catalogs?.last_page && (
                                <button className='pageMainBtnStyle py-2' onClick={() => loadMoreData('catalogs')}>
                                    {t('GeneralSearchPage.generalSearchLoadMorCatalog')}
                                </button>
                            )}
                    </div>
                )
            }
            {
                currentData?.services?.length !== 0 &&
                (
                    <div className="row  my-5">
                        <h2>
                            {t('GeneralSearchPage.generalSearchServicesTit')}
                        </h2>
                        {
                            currentData?.services?.map((serv) => (
                                <div className="col-lg-6 col-md-6 generalSearchCatalogCard my-4 ">
                                    <LastMinuteCard
                                        productImage={serv?.image || 'N/A'}
                                        productName={serv?.title}
                                        productLink={`/${serv?.company_slug}/service-details/${serv?.slug}`}
                                        showCustomContent={true}
                                        borderColor={'rgba(0, 0, 0, 0.5)'}
                                        onAddClick={''}
                                        showMoreDetails={true}
                                        productCatgeory={serv?.category}
                                        productCompany={serv?.company_name}
                                        productCompanySlug={serv?.company_slug}
                                    />
                                </div>
                            ))
                        }
                        {pagination.services?.current_page <
                            pagination.services?.last_page && (
                                <button className='pageMainBtnStyle py-2' onClick={() => loadMoreData('services')}>
                                   {t('GeneralSearchPage.generalSearchLoadMorService')}
                                </button>
                            )}

                    </div>
                )
            }
        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
