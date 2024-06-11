import React from 'react'
import './aboutCompany.css'
import aboutMark from '../../assets/companyImages/flat-color-icons_about.png'
import workHour from '../../assets/companyImages/tabler_clock-hour-7-filled.png'
import { Table } from 'react-bootstrap'
export default function AboutCompany({ company }) {
    return (
        <div className='aboutCompany__handler'>
            <div className="container">
                <div className="aboutCompany__content">
                    <div className='aboutCompany__title'>
                        <img src={company.aboutMark} alt="mark" />
                        <h1>About Us</h1>
                    </div>
                    <div className="aboutCompany__content__info">
                        <h3 className='breif__desc'>
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
                        ))}
                    </div>
                </div>
                <div className="aboutCompany__workHour">
                    <div className='aboutCompany__title'>
                        <img src={company.workHourImage} alt="hour" />
                        <h1>Working hours</h1>
                    </div>
                    <div className="working__hour__table">
                        {company.workingHours.map((hours, index) => (
                            <div className="working__hour__row" key={index}>
                                <div className="working__hour__day">{hours.day}</div>
                                <div className="colored__bg">

                                    from {hours.from}
                                </div>
                                <div className="colored__bg">
                                    to {hours.to}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="aboutCompany__location">
                    <iframe
                        title="Google Map"
                        src={company.mapUrl}
                        width="100%"
                        height="382"
                        style={{ border: '0' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    )
}
