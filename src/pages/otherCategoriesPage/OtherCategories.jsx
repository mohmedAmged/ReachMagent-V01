import React, { useEffect, useState } from 'react'
import HeaderSec from '../../components/myHeaderSec/HeaderSec'
import './otherCategories.css'
import MainSearchBar from '../../components/mainSearchBarSec/MainSearchBar'
import AllCategorySideBar from '../../components/allCategorySideBarSec/AllCategorySideBar'
import SubCategoryMainContent from '../../components/subCategoryMainContentSec/SubCategoryMainContent'
import sub1 from '../../assets/subCategsImages/sub1.png'
import sub2 from '../../assets/subCategsImages/sub 2.png'
import sub3 from '../../assets/subCategsImages/sub 3.png'
import sub4 from '../../assets/subCategsImages/sub 4.png'
import sub5 from '../../assets/subCategsImages/sub 5.png'
import sub6 from '../../assets/subCategsImages/sub 6.png'
import sub7 from '../../assets/subCategsImages/sub 7.png'
import MyLoader from '../../components/myLoaderSec/MyLoader'
export default function OtherCategories() {
    const [loading, setLoading] = useState(true);
    const arrOfCateg = [
        {
            name: 'All',
            id: 1
        },
        {
            name: 'One',
            id: 2
        },
        {
            name: 'Two',
            id: 3
        },
        {
            name: "Three",
            id: 4
        }
    ];

    const subCategsItems = [
        {
            subCategImg: sub1,
            subCategName: 'Home Improvment'
        },
        {
            subCategImg: sub2,
            subCategName: 'Garden Centers'
        },
        {
            subCategImg: sub3,
            subCategName: 'Furniture Stores'
        },
        {
            subCategImg: sub4,
            subCategName: 'Home Appliances'
        },
        {
            subCategImg: sub5,
            subCategName: 'Clothing Stores'
        },
        {
            subCategImg: sub6,
            subCategName: 'Footwear & Accessories'
        },
        {
            subCategImg: sub7,
            subCategName: 'Fashion Designers'
        },
    ];

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='otherCategory__handler'>
                        <HeaderSec title={'All Category'} />
                        <div className="otherCategory__searchBar d-flex justify-content-center">
                            <MainSearchBar categoryArr={arrOfCateg} heroSecContainerType='heroSec__container' />
                        </div>
                        <div className="otherCategory__display__handler d-flex mb-4">
                            <AllCategorySideBar />
                            <div className="subCategory__mainContent">
                                <SubCategoryMainContent subCategsItems={subCategsItems} />
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
