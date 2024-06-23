import React from 'react'
import './companyInfoCard.css'
import profile from '../../assets/companyImages/Group (1).png'
import verfuIcon from '../../assets/companyImages/Vector (3).png'
import callIcon from '../../assets/companyImages/call.svg'
import messageIcon from '../../assets/companyImages/messages-3.svg'
import { NavLink } from 'react-router-dom'
export default function CompanyInfoCard() {
    return (
        <div className='container'>
            <div className="companyInfoCard__handler">
                <div className="row">
                    <div className="col-lg-3 col-md-12 center__on__mobile">
                        <div className="company__profile__img">
                            <img src={profile} alt="profile" />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 ">
                        <div className="company__name">
                            <h1>
                                Homzmart
                            </h1>
                            <span>
                                <img src={verfuIcon} alt="icon" />
                            </span>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            Headquarters:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            El Mokattam, Cairo
                                        </p>
                                    </div>
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            Verification Status:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            Verified
                                        </p>
                                    </div>
                                    <div className="company__actions">
                                        <button className='btn__companyActions'>
                                            <img src={callIcon} alt="call-icon" />
                                        </button>
                                        <button className='btn__companyActions online__btn'>
                                            <img src={messageIcon} alt="message-icon" />
                                            <span className='online__circle'></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            industry:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            eCommerce
                                        </p>
                                    </div>
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            founded:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            2019
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            type:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            Public Company
                                        </p>
                                    </div>
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            Website:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            <NavLink to={'https://www.homzmart.com/'} className='nav-link'>
                                                https://www.homzmart.com/
                                            </NavLink>
                                        </p>
                                    </div>
                                    <div className="companyFollow__btn">
                                        <button className='pageMainBtnStyle'>
                                            + follow
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-12">
                        <div className="companyQutation__btn">
                            <button className='btnColoredBlue'>
                                Request Quotation
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
