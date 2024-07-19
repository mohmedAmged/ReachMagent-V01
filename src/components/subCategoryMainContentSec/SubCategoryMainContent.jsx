import React from 'react'
import './subCategoryMainContent.css'
import sub1 from '../../assets/subCategsImages/sub1.png'
export default function SubCategoryMainContent() {
    return (
        <div className='subCategoryMainContent__handler container  mt-5'>
            <div className="">
                <div className="subCategory__item">
                    <div className="subImage">
                        <img src={sub1} alt="" />
                    </div>
                    <div className="subTitle">
                        <h1 className='text-center'>
                            Home Improvment
                        </h1>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="subCategory__item">
                    <div className="subImage">
                        <img src={sub1} alt="" />
                    </div>
                    <div className="subTitle">
                        <h1 className='text-center'>
                            Home Improvment
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
