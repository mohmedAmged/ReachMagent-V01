import React from 'react'
import './companyMEdiaCard.css'
import { getYoutubeVideoId } from '../../functions/getYoutubeVideo'
export default function CompanyMediaCard({ type, mediaSrc }) {
    return (
        <div className='companyMediaCard__handler'>
            <div className="cardMedia__type">
                {
                    type === 'image' &&
                    <img src={mediaSrc} alt="media-img" />
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
        </div>
    )
}
