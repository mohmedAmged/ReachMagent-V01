import React, { useEffect, useState } from 'react'
import './singleCompany.css'
import HeroOnlyCover from '../../components/heroOnlyCoverSec/HeroOnlyCover'
import CompanyInfoCard from '../../components/companyInfoCardSec/CompanyInfoCard'
import ProductDetailsFilterationBar from '../../components/productDetailsFilterationBarSec/ProductDetailsFilterationBar'
import aboutMarkImage from '../../assets/companyImages/flat-color-icons_about.png'
import workHourImg from '../../assets/companyImages/tabler_clock-hour-7-filled.png'
import AboutCompany from '../../components/aboutCompanySec/AboutCompany'
import SingleCompanyRectangleSec from '../../components/singleCompanyRectangleSec/SingleCompanyRectangleSec'
import SingleCompanyNewsSec from '../../components/singleCompanyNewsSec/SingleCompanyNewsSec'
import CompanyContact from '../../components/companyContactSec/CompanyContact'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getDataFromAPI } from '../../functions/fetchAPI';
import LastMinuteCard from '../../components/lastMinuteCardSec/LastMinuteCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/autoplay";
import Autoplay from "../../../node_modules/swiper/modules/autoplay.mjs";
import MyLoader from '../../components/myLoaderSec/MyLoader'
import CompanyMediaCard from '../../components/companyMediaCardSec/CompanyMediaCard'
import BookAppointMentFrom from '../../components/bookAppointMentFrom/BookAppointMentFrom'
import PrevWorkCard from '../../components/prevWorkCard/PrevWorkCard'
import { usePrevWorkStore } from '../../store/AllPrevWorkStore'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader'
import { Lang } from '../../functions/Token'
import { useTranslation } from 'react-i18next'

export default function SingleCompany({ token }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const { companyId } = useParams();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const loginType = localStorage.getItem('loginType');

    const showCompaniesQuery = useQuery({
        queryKey: ['show-company'],
        queryFn: () => getDataFromAPI(`show-company/${companyId}?t=${new Date().getTime()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Locale": Lang
            }
        }),
        cacheTime: 1000 * 60 * 15,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const companyNetworks = useQuery({
        queryKey: ['company-networks'],
        queryFn: () => getDataFromAPI(`company-networks/${companyId}?t=${new Date().getTime()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Locale": Lang
            }
        }),
        cacheTime: 1000 * 60 * 15,
        retry: false,
        refetchOnWindowFocus: false,
    });
    const companyPrevWorks = useQuery({
        queryKey: ['company-prevWork'],
        queryFn: () => getDataFromAPI(`company-pervious-works/${companyId}?t=${new Date().getTime()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Locale": Lang
            }
        }),
        cacheTime: 1000 * 60 * 15,
        retry: false,
        refetchOnWindowFocus: false,
    });
    const prevWorksArr = companyPrevWorks?.data?.pervious_works?.pervious_works
    
    const [activeItem, setActiveItem] = useState(`${t('SingleCompanyPage.filterbarOverview')}`);

    // const items = [
    //     { name: 'Overview', active: activeItem === 'Overview' },
    //     { name: 'Services', active: activeItem === 'Services' },
    //     { name: 'Product Catalog', active: activeItem === 'Product Catalog'},
    //     { name: 'Media', active: activeItem === 'Media' },
    //     { name: 'Clients', active: activeItem === 'Clients' },
    //     { name: 'Partners', active: activeItem === 'Partners' },
    // ];
    const secondItemsToFilter = showCompaniesQuery?.data?.company?.companyServices?.map((ele)=>(ele?.categoryName));
    // const [selectedServiceCategory, setSelectedServiceCategory] = useState(secondItemsToFilter?.[0]);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState(null);
    useEffect(() => {
            if (activeItem === `${t('SingleCompanyPage.filterbarServices')}` && secondItemsToFilter?.length > 0 && !selectedServiceCategory) {
                setSelectedServiceCategory(secondItemsToFilter[0]);
            }
    }, [activeItem, secondItemsToFilter, selectedServiceCategory]);
    ///////
    const secondCatalogItemsToFilter = showCompaniesQuery?.data?.company?.companyCatalogs?.map((ele)=>(ele?.categoryName))
    const [selectedCatalogCategory, setSelectedCatalogCategory] = useState(null);   
    useEffect(() => {
            if (activeItem === `${t('SingleCompanyPage.filterbarProductCatalog')}` && secondCatalogItemsToFilter?.length > 0 && !selectedCatalogCategory) {
                setSelectedCatalogCategory(secondCatalogItemsToFilter[0]);
            }
    }, [activeItem, secondCatalogItemsToFilter, selectedCatalogCategory]);

    const [newData, setNewdata] = useState([])
    const fetchCompanyPosts = async () => {
      try {
        if (companyId) {
            const response = await axios.get(`${baseURL}/company-posts/${companyId}?t=${new Date().getTime()}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Locale": Lang
              }
            });
            setNewdata(response?.data?.data?.posts);
        }
        
      } catch (error) {
        // toast.error(error?.response?.data?.message);
      };
    };
  
    useEffect(() => {
      fetchCompanyPosts();
    }, []);
    
    const items = [
        {
            name: `${t('SingleCompanyPage.filterbarOverview')}`,
            active: activeItem === `${t('SingleCompanyPage.filterbarOverview')}`
        },
        {
            name: `${t('SingleCompanyPage.filterbarServices')}`,
            active: activeItem === `${t('SingleCompanyPage.filterbarServices')}`,
            render: showCompaniesQuery?.data?.company?.companyServices?.length > 0
        },
        {
            name: `${t('SingleCompanyPage.filterbarProductCatalog')}`,
            active: activeItem === `${t('SingleCompanyPage.filterbarProductCatalog')}`,
            render: showCompaniesQuery?.data?.company?.companyCatalogs?.length > 0
        },
        {
            name: `${t('SingleCompanyPage.filterbarMedia')}`,
            active: activeItem === `${t('SingleCompanyPage.filterbarMedia')}`,
            render: showCompaniesQuery?.data?.company?.companyPortfolio?.length > 0
        },
        {
            name: `${t('SingleCompanyPage.filterbarClients')}`,
            active: activeItem === `${t('SingleCompanyPage.filterbarClients')}`,
            render: companyNetworks?.data?.networks?.networks?.some(el => el.label === `${t('SingleCompanyPage.filterbarClientsLabel')}`)
        },
        {
            name: `${t('SingleCompanyPage.filterbarPartners')}`,
            active: activeItem === `${t('SingleCompanyPage.filterbarPartners')}`,
            render: companyNetworks?.data?.networks?.networks?.some(el => el.label === `${t('SingleCompanyPage.filterbarPartnersLabel')}`)
        },
        {
            name: `${t('SingleCompanyPage.filterbarPreviousWork')}`,
            active: activeItem === `${t('SingleCompanyPage.filterbarPreviousWork')}`,
            render: companyPrevWorks?.data?.pervious_works?.pervious_works?.length > 0
        },
        {
            name: `${t('SingleCompanyPage.filterbaInsights')}`,
            active: activeItem === `${t('SingleCompanyPage.filterbaInsights')}`,
            render: newData?.length > 0
        },
        
    ].filter(item => item.render !== false);

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };
const handleServiceCategoryClick = (name) => {
  setSelectedServiceCategory(name);
};

const handleCatalogCategoryClick = (name) => {
  setSelectedCatalogCategory(name);
};



    const serviceCategoryItems = secondItemsToFilter?.map(ele => ({
        name: ele,
        active: selectedServiceCategory === ele
    })) || [];

        const catalogCategoryItems = secondCatalogItemsToFilter?.map(ele => ({
        name: ele,
        active: selectedCatalogCategory === ele
    })) || [];

    useEffect(() => {
        // setTimeout(() => {
        //     if (showCompaniesQuery?.data?.company !== undefined) {
        //         setLoading(false);
        //     }
        // }, 3000);
         if (showCompaniesQuery?.data?.company !== undefined) {
        setLoading(false);
    }
    }, [showCompaniesQuery?.data?.company]);
    console.log(showCompaniesQuery?.data?.company);

    console.log(showCompaniesQuery?.data?.company);

    return (
        <>
            {
                loading ?
                    (<MyNewLoader />)
                    :
                    (<div className='singleCompany__handler'>
                        <HeroOnlyCover companyCover={showCompaniesQuery?.data?.company?.companyCover} />
                        <CompanyInfoCard handleShow={handleShow} showCompaniesQuery={showCompaniesQuery?.data?.company} token={token} />
                        <div className='my-5'>
                            <ProductDetailsFilterationBar items={items} onItemClick={handleItemClick} secondFilter={false}/>
                        </div>
                        {!showCompaniesQuery?.isLoading &&
                            <div className='container showCompany__Service'>
                                {
                                    activeItem === `${t('SingleCompanyPage.filterbarOverview')}` &&
                                    <AboutCompany showCompaniesQuery={showCompaniesQuery?.data?.company} />
                                }
                                {
                                    activeItem === `${t('SingleCompanyPage.filterbarServices')}` &&
                                    <div className='ms-4'>
                                    <div className="contactCompany-type">
                                        <ul  className='d-flex flex-wrap mb-3'>
                                            {serviceCategoryItems?.map((el, index) => {
                                            return (
                                                <li key={index} onClick={() => {
                                                handleServiceCategoryClick(el?.name);
                                                }} className={`me-2 ${el.active ? 'contactCompany-type-active' : ''}`}>
                                                {el?.name}
                                                </li>
                                            )
                                            })}
                                        </ul>
                                    </div>
                                    {
                                    selectedServiceCategory &&
                                    showCompaniesQuery?.data?.company?.companyServices
                                        ?.filter(serviceGroup => serviceGroup.categoryName === selectedServiceCategory)
                                        ?.map((el)=>(
                                    <>
                                    <Swiper
                                        className='mySwiper'
                                        modules={[Autoplay]}
                                        autoplay={{
                                            delay: 2500,
                                            pauseOnMouseEnter: true,
                                            disableOnInteraction: false
                                        }}
                                        breakpoints={{
                                            300: {
                                                slidesPerView: 1.1,
                                                spaceBetween: 10
                                            },
                                            426: {
                                                slidesPerView: 1.2,
                                                spaceBetween: 20
                                            },
                                            600: {
                                                slidesPerView: 2.2,
                                                spaceBetween: 15
                                            },
                                            768: {
                                                slidesPerView: 2.2,
                                                spaceBetween: 15
                                            },
                                            995: {
                                                slidesPerView: 3.2,
                                                spaceBetween: 20
                                            },
                                        }}
                                    >
                                        {el?.services?.map((item) => {
                                            return (
                                                <SwiperSlide className=' my-3' key={item?.serviceId}>
                                                    <LastMinuteCard
                                                        productImage={item?.serviceImage}
                                                        productName={item?.serviceTitle}
                                                        showCustomContent={true}
                                                        productLink={`/${companyId}/service-details/${item?.serviceSlug}`}
                                                        borderColor={'rgba(0, 0, 0, 0.5)'}
                                                        onAddClick={''}
                                                        productCatgeory={item?.serviceCategory}
                                                    />
                                                </SwiperSlide>
                                            )
                                        })}
                                    </Swiper>
                                    </>
                                    ))}
                                
                                    {!selectedServiceCategory && (
                                        <h5 className='text-center text-muted text-capitalize mb-4'>
                                            Please select a service category
                                        </h5>
                                    )}

                                    </div>
                                }
                                {
                                    activeItem === `${t('SingleCompanyPage.filterbarProductCatalog')}` &&
                                    <div className='ms-4'>
                                    {/* <ProductDetailsFilterationBar items={catalogCategoryItems} onItemClick={handleCatalogCategoryClick} secondFilter={true}/> */}
                                    <div className="contactCompany-type">
                                        <ul className='mb-3 d-flex flex-wrap'>
                                            {catalogCategoryItems?.map((el, index) => {
                                            return (
                                                <li key={index} onClick={() => {
                                                handleCatalogCategoryClick(el?.name);
                                                }} className={` me-2 ${el.active ? 'contactCompany-type-active' : ''}`}>
                                                {el?.name}
                                                </li>
                                            )
                                            })}
                                        </ul>
                                    </div>
                                    {
                                    selectedCatalogCategory &&
                                    showCompaniesQuery?.data?.company?.companyCatalogs
                                        ?.filter(catalogGroup => catalogGroup.categoryName === selectedCatalogCategory)
                                        ?.map((el)=>(
                                            <>
                                        <Swiper
                                            className='mySwiper'
                                            modules={[Autoplay]}
                                            autoplay={{
                                                delay: 2500,
                                                pauseOnMouseEnter: true,
                                                disableOnInteraction: false
                                            }}
                                            breakpoints={{
                                                300: {
                                                    slidesPerView: 1.1,
                                                    spaceBetween: 10
                                                },
                                                426: {
                                                    slidesPerView: 1.2,
                                                    spaceBetween: 20
                                                },
                                                600: {
                                                    slidesPerView: 2.2,
                                                    spaceBetween: 15
                                                },
                                                768: {
                                                    slidesPerView: 2.2,
                                                    spaceBetween: 15
                                                },
                                                995: {
                                                    slidesPerView: 3.2,
                                                    spaceBetween: 20
                                                },
                                            }}
                                        >
                                            {el?.catalogs?.map((item) => {
                                                return (
                                                    <SwiperSlide className=' my-3' key={item?.catalogId}>
                                                            <LastMinuteCard
                                                            productImage={item?.catalogImages[0].media}
                                                            productName={item?.catalogTitle}
                                                            productLink={`/${companyId}/catalog-details/${item?.catalogSlug}`}
                                                            showCustomContent={true}
                                                            borderColor={'rgba(0, 0, 0, 0.5)'}
                                                            onAddClick={''}
                                                            />
                                                    </SwiperSlide>
                                                )
                                            })}
                                        </Swiper>
                                        {!selectedCatalogCategory && (
                                        <h5 className='text-center text-muted text-capitalize mb-4'>
                                            Please select a Catalog category
                                        </h5>
                                    )}
                                            </>
                                        ))
                                    }
                                        
                                    </div>
                                }
                                {
                                    activeItem === 'Products' &&
                                    <>
                                        <Swiper
                                            className='mySwiper'
                                            modules={[Autoplay]}
                                            autoplay={{
                                                delay: 2500,
                                                pauseOnMouseEnter: true,
                                                disableOnInteraction: false
                                            }}
                                            breakpoints={{
                                                300: {
                                                    slidesPerView: 1.1,
                                                    spaceBetween: 10
                                                },
                                                426: {
                                                    slidesPerView: 1.2,
                                                    spaceBetween: 20
                                                },
                                                600: {
                                                    slidesPerView: 2.2,
                                                    spaceBetween: 15
                                                },
                                                768: {
                                                    slidesPerView: 2.2,
                                                    spaceBetween: 15
                                                },
                                                995: {
                                                    slidesPerView: 3.2,
                                                    spaceBetween: 20
                                                },
                                            }}
                                        >
                                            {showCompaniesQuery?.data?.company?.companyProducts?.map((el) => {
                                                return (
                                                    <SwiperSlide className=' my-3' key={el?.productId}>
                                                        <LastMinuteCard
                                                            productImage={el?.productMedias[0].image}
                                                            productName={el?.productTitle}
                                                            showCustomContent={true}
                                                            borderColor={'rgba(0, 0, 0, 0.5)'}
                                                            onAddClick={''}
                                                        />
                                                    </SwiperSlide>
                                                )
                                            })}
                                        </Swiper>
                                    </>
                                }
                                {
                                    activeItem === `${t('SingleCompanyPage.filterbarMedia')}` &&
                                    <>
                                        {
                                            <Swiper
                                                className='mySwiper'
                                                modules={[Autoplay]}
                                                autoplay={{
                                                    delay: 2500,
                                                    pauseOnMouseEnter: true,
                                                    disableOnInteraction: false
                                                }}
                                                breakpoints={{
                                                    300: {
                                                        slidesPerView: 1.1,
                                                        spaceBetween: 10
                                                    },
                                                    426: {
                                                        slidesPerView: 1.2,
                                                        spaceBetween: 20
                                                    },
                                                    600: {
                                                        slidesPerView: 2.2,
                                                        spaceBetween: 15
                                                    },
                                                    768: {
                                                        slidesPerView: 2.2,
                                                        spaceBetween: 15
                                                    },
                                                    995: {
                                                        slidesPerView: 3.2,
                                                        spaceBetween: 20
                                                    },
                                                }}
                                            >
                                                {showCompaniesQuery?.data?.company?.companyPortfolio?.map((el) => {
                                                    return (
                                                        <SwiperSlide className=' my-3' key={el?.id}>
                                                            <CompanyMediaCard type={el?.type} mediaSrc={el?.link}

                                                            />
                                                        </SwiperSlide>
                                                    )
                                                })}
                                            </Swiper>
                                        }

                                    </>
                                }
            {
                activeItem === `${t('SingleCompanyPage.filterbarClients')}` &&
                <>
                    {
                        companyNetworks?.data?.networks?.networks ?
                            (() => {
                                const clientNetwork = companyNetworks.data.networks.networks.find(
                                    (el) => el.label === `${t('SingleCompanyPage.filterbarClientsLabel')}`
                                );
                                return clientNetwork ? (
                                    <Swiper
                                        className="mySwiper"
                                        modules={[Autoplay]}
                                        autoplay={{
                                            delay: 2500,
                                            pauseOnMouseEnter: true,
                                            disableOnInteraction: false,
                                        }}
                                        breakpoints={{
                                            300: {
                                                slidesPerView: 1.1,
                                                spaceBetween: 10,
                                            },
                                            426: {
                                                slidesPerView: 1.2,
                                                spaceBetween: 20,
                                            },
                                            600: {
                                                slidesPerView: 2.2,
                                                spaceBetween: 15,
                                            },
                                            768: {
                                                slidesPerView: 2.2,
                                                spaceBetween: 15,
                                            },
                                            995: {
                                                slidesPerView: 3.2,
                                                spaceBetween: 20,
                                            },
                                        }}
                                    >
                                        {companyNetworks.data.networks.networks
                                            .filter((el) => el.label === `${t('SingleCompanyPage.filterbarClientsLabel')}`)
                                            .map((el) => (
                                                <SwiperSlide className="my-3" key={el?.id}>
                                                    <CompanyMediaCard
                                                        type={"image"}
                                                        mediaSrc={el?.logo}
                                                        mainInfo={true}
                                                        mainInfoName={el?.name}
                                                        mainInfoType={el?.label}
                                                        mainInfoLink={el?.network_slug !== null ? `/${el.network_slug}` : ''}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                    </Swiper>
                                ) : (
                                    <h5 className="text-center text-danger text-capitalize mb-4">
                                        {t('SingleCompanyPage.filterbarNoAddedClients')}
                                    </h5>
                                );
                            })()
                            :
                            <h5 className="text-center text-danger text-capitalize mb-4">
                                {t('SingleCompanyPage.filterbarNoAddedNetworks')}
                            </h5>
                    }
                </>
            }
    {
        activeItem === `${t('SingleCompanyPage.filterbarPartners')}` &&
        <>
            {
                companyNetworks?.data?.networks?.networks ?
                    (() => {
                        const clientNetwork = companyNetworks.data.networks.networks.find(
                            (el) => el.label === `${t('SingleCompanyPage.filterbarPartnersLabel')}`
                        );
                        return clientNetwork ? (
                            <Swiper
                                className="mySwiper"
                                modules={[Autoplay]}
                                autoplay={{
                                    delay: 2500,
                                    pauseOnMouseEnter: true,
                                    disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    300: {
                                        slidesPerView: 1.1,
                                        spaceBetween: 10,
                                    },
                                    426: {
                                        slidesPerView: 1.2,
                                        spaceBetween: 20,
                                    },
                                    600: {
                                        slidesPerView: 2.2,
                                        spaceBetween: 15,
                                    },
                                    768: {
                                        slidesPerView: 2.2,
                                        spaceBetween: 15,
                                    },
                                    995: {
                                        slidesPerView: 3.2,
                                        spaceBetween: 20,
                                    },
                                }}
                            >
                                {companyNetworks.data.networks.networks
                                    .filter((el) => el.label === `${t('SingleCompanyPage.filterbarPartnersLabel')}`)
                                    .map((el) => (
                                        <SwiperSlide className="my-3" key={el?.id}>
                                            <CompanyMediaCard
                                                type={"image"}
                                                mediaSrc={el?.logo}
                                                mainInfo={true}
                                                mainInfoName={el?.name}
                                                mainInfoType={el?.label}
                                                mainInfoLink={el?.network_slug !== null ? `/${el.network_slug}` : ''}
                                            />
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                        ) : (
                            <h5 className="text-center text-danger text-capitalize mb-4">
                                {t('SingleCompanyPage.filterbarNoAddedClients')}
                            </h5>
                        );
                    })()
                    :
                    <h5 className="text-center text-danger text-capitalize mb-4">
                    {t('SingleCompanyPage.filterbarNoAddedNetworks')}

                    </h5>
            }
        </>
    }
                                {
                                    activeItem === `${t('SingleCompanyPage.filterbarPreviousWork')}` &&
                                    <>
                                        {
                                            <Swiper
                                                className='mySwiper'
                                                modules={[Autoplay]}
                                                autoplay={{
                                                    delay: 2500,
                                                    pauseOnMouseEnter: true,
                                                    disableOnInteraction: false
                                                }}
                                                breakpoints={{
                                                    300: {
                                                        slidesPerView: 1.1,
                                                        spaceBetween: 10
                                                    },
                                                    426: {
                                                        slidesPerView: 1.2,
                                                        spaceBetween: 20
                                                    },
                                                    600: {
                                                        slidesPerView: 2.2,
                                                        spaceBetween: 15
                                                    },
                                                    768: {
                                                        slidesPerView: 2.2,
                                                        spaceBetween: 15
                                                    },
                                                    995: {
                                                        slidesPerView: 3.2,
                                                        spaceBetween: 20
                                                    },
                                                }}
                                            >
                                                {
                                                    prevWorksArr?.map((row) => (
                                                        <SwiperSlide className="my-3" key={row?.id}>
                                                            <PrevWorkCard page={'singleCompany'} id={row?.id} title={row?.title} description={row?.description} img={row?.image} type={row?.type} />
                                                        </SwiperSlide>
                                                    ))
                                                }
                                            </Swiper>
                                        }
                                    </>
                                }
                            </div>
                        }
                        {
                            showCompaniesQuery?.data?.company?.companyFaqs !== 0 ?
                                <>
                                    <SingleCompanyRectangleSec showCompaniesQuery={showCompaniesQuery?.data?.company} />
                                </>
                                :
                                ''
                        }
                        {/* <ReadyToBuySec fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} token={token} showCompaniesQuery={showCompaniesQuery} companies={showCompaniesQuery?.data?.company} secMAinTitle={`Ready-To-Buy From ${showCompaniesQuery?.data?.company?.companyName}`} /> */}


                        <SingleCompanyNewsSec newData={newData} companyId={companyId} token={token} />
                        {/* <SingleCompanyAffiliate /> */}
                        {
                            token &&
                            <BookAppointMentFrom show={show} handleClose={handleClose} token={token} companyId={companyId} company={showCompaniesQuery?.data} />
                        }
                        { showCompaniesQuery?.data?.company?.companyForms?.length !==0 &&
                            <CompanyContact company={showCompaniesQuery} token={token} companyId={companyId} />
                        }

                    </div >)
            }
        </>
    );
};