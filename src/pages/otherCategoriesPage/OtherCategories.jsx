import React from 'react'
import HeaderSec from '../../components/myHeaderSec/HeaderSec'
import './otherCategories.css'
import MainSearchBar from '../../components/mainSearchBarSec/MainSearchBar'
import AllCategorySideBar from '../../components/allCategorySideBarSec/AllCategorySideBar'
export default function OtherCategories() {
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
    ]
    return (
        <div className='otherCategory__handler'>
            <HeaderSec title={'All Category'} />
            <div className="otherCategory__searchBar d-flex justify-content-center">
                <MainSearchBar categoryArr={arrOfCateg} heroSecContainerType='heroSec__container'/>
            </div>
            <div className="otherCategory__display__handler d-flex mb-4">
                <AllCategorySideBar />
            </div>
        </div>
    )
}
