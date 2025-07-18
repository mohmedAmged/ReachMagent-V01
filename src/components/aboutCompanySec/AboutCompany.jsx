import React, { useEffect, useState } from 'react'
import './aboutCompany.css'
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import aboutIcon from '../../assets/companyImages/enterprise.png'
import mapIcon from '../../assets/companyImages/map.png'
import timeIcon from '../../assets/companyImages/working-time.png'
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setLocation, initialPosition }) => {
     const { t } = useTranslation();
   
    const [position, setPosition] = useState(initialPosition);
    const map = useMap();

    // useMapEvents({
    //     click(e) {
    //         setPosition(e?.latlng);
    //         setLocation(e?.latlng);
    //     },
    // });

    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
            map.setView(initialPosition, 16);
        }
    }, [initialPosition, map]);

    return position === null ? null : (
        <Marker position={position} icon={customIcon}></Marker>
    );
};

export default function AboutCompany({ company, showCompaniesQuery }) {
    const [initialPosition,setInitialPosition] = useState([0, 0]);
    useEffect(()=>{
        setInitialPosition([
            showCompaniesQuery?.companyBranches[0]?.branchLatitude,
            showCompaniesQuery?.companyBranches[0]?.branchLongitude
        ])
    },[showCompaniesQuery]);
    
    return (
        <div className='aboutCompany__handler'>
            <div className="container">
                <div className="aboutCompany__content">
                    <div className='aboutCompany__title'>
                        <img src={aboutIcon} alt="mark" />
                        <h1>{t('SingleCompanyPage.overViewAboutUs')}</h1>
                    </div>
                    <div className="aboutCompany__content__info my-3">
                        <p className='fixed__desc'>{showCompaniesQuery?.companyAboutUs}</p>
                        {/* <h3 className='breif__desc'>
                            {company.briefDescription}
                        </h3>
                        <ul>
                            {company.details.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))}
                        </ul>
                        {company.faq.map((faqItem, index) => (
                            <div className="faqForCompany__box" key={index}>
                                <h3 className='fixed__titles'>{faqItem.title}</h3>
                                <p className='fixed__desc'>{faqItem.description}</p>
                            </div>
                        ))} */}
                    </div>
                </div>
                {
                    showCompaniesQuery?.workingHours?.length !== 0 ?
                    <div className="aboutCompany__workHour">
                    <div className='aboutCompany__title'>
                        <img src={timeIcon} alt="hour" />
                        <h1>{t('SingleCompanyPage.overViewWorkingHours')}</h1>
                    </div>
                    <div className="working__hour__table">
                        {showCompaniesQuery?.workingHours?.map((el, index) => (
                            <div className="working__hour__row" key={index}>
                                <div className="working__hour__day">{el?.day_of_week}</div>
                                <div className="colored__bg">

                                    {t('SingleCompanyPage.overViewWorkingHoursFrom')} {el?.opening_time}
                                </div>
                                <div className="colored__bg">
                                    {t('SingleCompanyPage.overViewWorkingHoursTo')} {el?.closing_time}
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                    :
                    ''
                }
                <div className="aboutCompany__location">
                    <div className='aboutCompany__title'>
                        <img src={mapIcon} alt="mark" />
                        <h1>{t('SingleCompanyPage.overViewCompanyLocation')}</h1>
                    </div>
                    <div className="aboutCompany__content__info my-3">
                        <p className='fixed__desc my-3'>{showCompaniesQuery?.companyBranches[0].branchCountry}, {showCompaniesQuery?.companyBranches[0].branchCity}</p>
                        <MapContainer center={initialPosition} zoom={0} style={{ height: '400px', width: '100%', zIndex: '1' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker initialPosition={initialPosition} />
                        </MapContainer>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}
