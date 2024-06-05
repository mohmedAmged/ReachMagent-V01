import React from 'react'
import './companyCard.css'
export default function CopmanyCard({coverImg, companyProfile, companyName, companyUser, productsCount, dealsCount, ownerCount, cardDesc}) {
    return (
        <div className='companyCard__item'>
            <div className="card__cover">
                <img src={coverImg} alt="cover" />
            </div>
            <div className="card__content">
                <div className="card__info">
                    <div className="company__profile">
                        <img src={companyProfile} alt="profile" />
                    </div>
                    <div className="company__name">
                        <h2>
                            {companyName}
                        </h2>
                    </div>
                    <div className="company__user">
                        <h5>
                            {companyUser}
                        </h5>
                    </div>
                    <div className="company__data">
                        <div className="company__products compDataStyle">
                            <h3>
                                {productsCount}
                            </h3>
                            <p>
                                products
                            </p>
                        </div>
                        <div className="company__deals compDataStyle">
                            <h3>
                                {dealsCount}
                            </h3>
                            <p>
                                deals
                            </p>
                        </div>
                        <div className="company__owner compDataStyle">
                            <h3>
                                {ownerCount}
                            </h3>
                            <p>
                                owners
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card__actions">
                    <button className='pageMainBtnStyle'>
                        + follow
                    </button>
                </div>
            </div>
            <div className="card__description">
                <p>
                    {cardDesc}
                </p>
            </div>
        </div>
    )
}
