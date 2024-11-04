import React, { useEffect, useState } from 'react'
import './userChatSidebar.css'
import avatar1 from '../../assets/messageImages/Avatar1.png'
import { useNavigate } from 'react-router-dom'

export default function UserChatSidebar({chats,setActiveChat, userNowInfo, activeChatId}) {
    const navigate = useNavigate()
    const [activeClassItemId, setActiveClassItemId] = useState(null);
    console.log(chats);
    useEffect(() => {
        if (activeChatId) {
            setActiveClassItemId(parseInt(activeChatId)); 
        }
    }, [activeChatId]);
    return (
        <div className='userChatSidebar__content'>
            <div className="container">
                <div className="yourInfoPart">
                    <div className="yourMainInfo">
                        <div className="yourAvatarImage">
                            <span className={`online chatStatuNow`}></span>
                            <img src={userNowInfo?.image} alt="avatar-1" />
                        </div>
                        <div className="yourContactInfo">
                            <h1>
                                {userNowInfo?.name}
                            </h1>
                            <p>
                                {userNowInfo?.email}
                            </p>
                        </div>
                    </div>
                    {/* <div className="yourStatusInfo w-50">
                        <select name="" id="" className='form-select'>
                            <option value="" disabled>change Status</option>
                            <option value="">online</option>
                            <option value="">offline</option>
                        </select>
                    </div> */}
                </div>
                {/* <div className="yourSearchUsers">
                    <div className="form__part input__search__part w-100">
                        <i className="bi bi-search"></i>
                        <input type="text" placeholder='Search...' />
                    </div>
                </div> */}
                <div className="yourChatsPart">
                    {
                        chats?.map((item, index) => {
                            return (
                                <div  onClick={() => {
                                    navigate(`/your-messages/${item?.id}`);
                                    setActiveClassItemId(item?.id); 
                                }} key={index} className={`messageChatItem ${activeClassItemId === item?.id ? 'activeHover' : ''}`}>
                                    <div className="messageChatMainInfo">
                                        <div className="messageChatImg">
                                            {/* <span className={`${item.chatStatu} chatStatuNow`}></span> */}
                                            <img src={item?.receiverImage} alt="avatar-2" />
                                        </div>
                                        <div className="messageChatInfo">
                                            <div className="messageChatName">
                                                <h3>
                                                    {item?.receiverName}
                                                </h3>
                                            </div>
                                            <div className="messageChatContent">
                                                {
                                                    item?.type === 'text' &&(
                                                        <p>
                                                          {item?.sendBy}: {item?.message?.slice(0,30)}
                                                        </p>
                                                    )
                                                   
                                                }
                                                {
                                                    item?.type === 'image' &&(
                                                        <p>
                                                            {item?.sendBy}: 
                                                            <i className="bi bi-card-image ps-2 pe-1"></i>
                                                            Image
                                                        </p>
                                                    )
                                                   
                                                }
                                                {
                                                    item?.type === 'audio' &&(
                                                        <p>
                                                            {item?.sendBy}: 
                                                            <i className="bi bi-file-earmark-music ps-2 pe-1"></i>
                                                            Audio
                                                        </p>
                                                    )
                                                   
                                                }
                                                {
                                                    item?.type === 'video' &&(
                                                        <p>
                                                            {item?.sendBy}: 
                                                            <i className="bi bi-file-earmark-play ps-2 pe-1"></i>
                                                            Video
                                                        </p>
                                                    )
                                                   
                                                }
                                                {
                                                    item?.type === 'file' &&(
                                                        <p>
                                                            {item?.sendBy}: 
                                                            <i className="bi bi-file-earmark ps-2 pe-1"></i>
                                                            File
                                                        </p>
                                                    )
                                                   
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="timeOfMessage">
                                        <span>{item?.date} {item?.time}</span>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}
