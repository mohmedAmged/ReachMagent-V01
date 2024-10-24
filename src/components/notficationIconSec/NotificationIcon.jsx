import React, { useEffect, useRef, useState } from 'react'
import './notificationIcon.css'
import notIcon from '../../assets/icons/bell-fill.svg'
import { useNavigate } from 'react-router-dom'
export default function NotificationIcon() {
    const navigate = useNavigate()
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    const iconRef = useRef(null);

    const toggleNotifications = () => {
        setShowNotifications(prevState => !prevState);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current && 
                !notificationRef.current.contains(event.target) &&
                iconRef.current && 
                !iconRef.current.contains(event.target)
            ) {
                setShowNotifications(false); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [notificationRef, iconRef]);


    const nostsItems = [
        {
            notTitle: 'New Challenge is now open!',
            img: notIcon,
            notLink: '/profile/',
            notBody: 'loremloremloremlorem'
        },
        {
            notTitle: 'New Challenge is now open!',
            img: notIcon,
            notLink: '/profile/',
            notBody: 'loremloremloremlorem'
        },
        {
            notTitle: 'New Challenge is now open!',
            img: notIcon,
            notLink: '/profile/',
            notBody: 'loremloremloremlorem'
        },
    ]

    return (
        <div className='notificationIcon__handler'>
            <i ref={iconRef} className="bi bi-bell-fill" onClick={toggleNotifications}></i>
            <div 
                ref={notificationRef}
                className={`notficationBody__handler ${showNotifications ? 'show' : 'hide'}`}
            >
                <div className="notHeaderBox">
                    <h3>
                        Notifications
                    </h3>
                </div>
                <div className="NotsItems_Box">
                    {
                        nostsItems?.map((el,idx)=>(
                            <div onClick={()=>(
                                navigate(`${el?.notLink}`)
                            )} key={idx} className="notItem d-flex align-items-center gap-2">
                                <img src={el?.img} alt="" />
                                <div className="itemInfo">
                                    <h5>
                                        {el.notTitle}
                                    </h5>
                                    <p>
                                        {el?.notBody}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                    <button className='viewMoreNotfiBtn'>view more</button>
                </div>
            </div>
        </div>
    )
}
