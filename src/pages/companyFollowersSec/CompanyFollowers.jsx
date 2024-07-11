import React from 'react'
import './companyFollowers.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import avatar4 from '../../assets/messageImages/avatar4.jpg'
export default function CompanyFollowers({ loginType, token }) {
    const followersItems = [
        {
            followerName: 'mohamed amged',
            followerImg: avatar4,
            userName: 'email1234@email.com'
        },
        {
            followerName: 'ibrahim ahmed',
            followerImg: avatar4,
            userName: 'email1234@email.com'
        },
        {
            followerName: 'hamada',
            followerImg: avatar4,
            userName: 'email1234@email.com'
        },
        {
            followerName: 'ayman adel',
            followerImg: avatar4,
            userName: 'email1234@email.com'
        },

    ]
    return (
        <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
                <MainContentHeader />
                <div className='content__view__handler company__follower__sec'>
                    <ContentViewHeader title={'All Followers'} />
                    <div className="follower__filter__search">
                        <div className="row">
                            <div className="col-12">
                                <div className="form__part input__search__part">
                                    <i className="bi bi-search"></i>
                                    <input type="text" placeholder='Search followers...' />
                                </div>
                            </div>
                        </div>
                        <div className='followerInfo__handler row'>
                            {
                                followersItems?.map((el, index) => {
                                    return (
                                        <div key={index} className="followerInfo__Item col-12">
                                            <div className="followerImage">
                                                <img src={el?.followerImg} alt="avatar-1" />
                                            </div>
                                            <div className="followerContactInfo">
                                                <h1>
                                                    {el?.followerName}
                                                </h1>
                                                <div className="follower__status">
                                                    <p>
                                                        {el?.userName}
                                                    </p>
                                                    <p className='isUsersfollowed'>
                                                        follows you
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
