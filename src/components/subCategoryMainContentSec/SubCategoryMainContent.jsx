import React from 'react'
import './subCategoryMainContent.css'
export default function SubCategoryMainContent({subCategsItems}) {

    return (
        <div className='subCategoryMainContent__handler container  mt-5'>
            {
                subCategsItems?.map((el, index) => {
                    return (
                        <div key={index} className="subCategory__item">
                            <div className="subImage">
                                <img src={el?.subCategImg} alt={el?.subCategName} />
                            </div>
                            <div className="subTitle">
                                <h1 className='text-center'>
                                    {el?.subCategName}
                                </h1>
                            </div>
                        </div>
                    )
                })
            }


        </div>
    )
}
