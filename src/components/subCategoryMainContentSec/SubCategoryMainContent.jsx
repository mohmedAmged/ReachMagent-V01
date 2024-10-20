import React from 'react'
import './subCategoryMainContent.css'
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import locationIcon from "../../assets/icons/Duotone.png";
import userIcon from "../../assets/icons/Duotone3.png";
export default function SubCategoryMainContent({ contentData }) {

    return (
        <div className='subCategoryMainContent__handler mainContentAllCompanies__handler  mt-5'>
            {
                contentData?.companies?.length !== 0 ?
                    <>
                        {
                            contentData?.companies?.map((el) => (
                                <div key={el?.id} className="mb-5">
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
                                                    <span>{el?.companySubCategory}</span>
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
                                                {/* <div className="subInfoItem">
                                        <img src={emailIcon} alt="locateion-icon" />

                                        <NavLink to={el?.companyWebsiteLink}>
                                            <span>Website</span>
                                        </NavLink>
                                    </div> */}
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
                            ))
                        }
                    </>
                    :
                    <div className="row">
                        <div className="col-12">
                            <h1 className=" text-danger fs-3 text-capitalize text-center mt-4">
                                no company with this filter
                            </h1>
                        </div>
                    </div>
            }

        </div>
    )
}
