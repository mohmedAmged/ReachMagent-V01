import React from 'react'
import './companyMEdiaCard.css'
import { getYoutubeVideoId } from '../../functions/getYoutubeVideo'
import { NavLink } from 'react-router-dom'
export default function CompanyMediaCard({ type, mediaSrc, mainInfo, mainInfoName, mainInfoLink, mainInfoType }) {
    return (
        <div className='companyMediaCard__handler'>
            <div className="cardMedia__type">
                {
                    type === 'image' &&
                    <NavLink to={mediaSrc} target='_blank'>
                        <img src={mediaSrc} alt="media-img" />
                    </NavLink>
                }
                {
                    type === 'link' &&
                    <iframe
                        width="289px"
                        height="191px"
                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(mediaSrc)}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                }
            </div>
            {
                mainInfo === true ?
                <div className="card__main-info my-3 d-flex justify-content-between align-items-center">
                    <NavLink to={mainInfoLink} target='_blank' className={'nav-link'}>
                        <h5 className='text-capitalize fs-4'>{mainInfoName}</h5>
                    </NavLink>
                    <p style={{color:'#412794'}} className='text-capitalize'>
                        {mainInfoType}
                    </p>
                </div>
                : 
                ''
            }
        </div>
    )
}
