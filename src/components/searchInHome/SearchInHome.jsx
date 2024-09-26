import React from 'react'
import { scrollToTop } from '../../functions/scrollToTop';
import locationIcon from "../../assets/icons/Duotone.png";
import userIcon from "../../assets/icons/Duotone3.png";
import emailIcon from "../../assets/icons/Duotone 2.png";
import { NavLink } from 'react-router-dom';

export default function SearchInHome({ currentData }) {
    console.log(currentData)
    return (
        <div className="MyAllCompanies__handler">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-4">
                    </div>
                    <div className="col-lg-9 col-md-8">
                        <div className="mainContentAllCompanies__handler">
                            {currentData?.length === 0 ?
                                (
                                    <div className="row">
                                        <div className="col-12">
                                            <h1 className=" text-danger fs-3 text-capitalize text-center mt-4">
                                                no company with this filter
                                            </h1>
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div className="row gap-3">
                                        {currentData?.map((el) => {
                                            return (
                                                <div key={el?.id} className="col-12">
                                                    <div className="CompanyContentItem">
                                                        <div className="compImage">
                                                            <img
                                                                src={el?.companyLogo}
                                                                alt={el?.companyName}
                                                            />
                                                        </div>
                                                        <div className="compMainInfo">
                                                            <h5 className="mb-2">{el?.companyName}</h5>
                                                            <div className="companySubInfo mb-2">
                                                                <div className="subInfoItem">
                                                                    <img src={userIcon} alt="locateion-icon" />
                                                                    <span>E-Commerce</span>
                                                                </div>
                                                                <div className="subInfoItem">
                                                                    <img
                                                                        src={locationIcon}
                                                                        alt="locateion-icon"
                                                                    />
                                                                    <span>
                                                                        {el?.companyBranches[0]?.branchCity}
                                                                    </span>
                                                                </div>
                                                                <div className="subInfoItem">
                                                                    <img src={emailIcon} alt="locateion-icon" />

                                                                    <NavLink to={el?.companyWebsiteLink}>
                                                                        <span>Website</span>
                                                                    </NavLink>
                                                                </div>
                                                            </div>
                                                            <div className="companyDescrip mb-2">
                                                                <p>{el?.companyAboutUs}</p>
                                                            </div>
                                                            <div className="companyMainCountry">
                                                                {/* <img src={flag} alt="flag" /> */}
                                                                <i className="bi bi-crosshair2"></i>
                                                                <span>
                                                                    {el?.companyBranches[0]?.branchCountry}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="companyActions">
                                                            <NavLink
                                                                onClick={() => {
                                                                    scrollToTop();
                                                                }}
                                                                className={"nav-link"}
                                                                to={`/show-company/${el?.companyId}`}
                                                            >
                                                                <button className="pageMainBtnStyle">
                                                                    more info
                                                                </button>
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
