import React from 'react'
import './userChatSidebar.css'
import avatar1 from '../../assets/messageImages/Avatar1.png'
import avatar2 from '../../assets/messageImages/Avatar2.png'
import avatar3 from '../../assets/messageImages/Avatar3.png'
import { useNavigate } from 'react-router-dom'

export default function UserChatSidebar({chats,setActiveChat}) {
    const navigate = useNavigate()
    const messgaeChatsItems = [
        {
            chatName: 'Jumia',
            chatImg: avatar3,
            chatMessage: 'Me: massage goes here',
            messageTime: '9:12 PM',
            chatStatu: 'online',
            activeHover: 'activeHover'
        },
        {
            chatName: 'Mohamed Amged',
            chatImg: avatar2,
            chatMessage: 'Me: massage goes here',
            messageTime: '5:12 AM',
            chatStatu: 'offline'
        },
        {
            chatName: 'Israa Mohamed',
            chatImg: avatar2,
            chatMessage: 'Typing..',
            messageTime: '7:12 PM',
            chatStatu: 'online'
        },
        {
            chatName: 'Ahmed Adel',
            chatImg: avatar2,
            chatMessage: 'Me: massage goes here',
            messageTime: '9:12 PM',
            chatStatu: 'online'
        },
        {
            chatName: 'Ahmed Adel',
            chatImg: avatar2,
            chatMessage: 'Me: massage goes here',
            messageTime: '9:12 PM',
            chatStatu: 'online'
        },
        {
            chatName: 'Ahmed Adel',
            chatImg: avatar2,
            chatMessage: 'Me: massage goes here',
            messageTime: '9:12 PM',
            chatStatu: 'online'
        },
        {
            chatName: 'Ahmed Adel',
            chatImg: avatar2,
            chatMessage: 'Me: massage goes here',
            messageTime: '9:12 PM',
            chatStatu: 'online'
        },
    ];
    return (
        <div className='userChatSidebar__content'>
            <div className="container">
                <div className="yourInfoPart">
                    <div className="yourMainInfo">
                        <div className="yourAvatarImage">
                            <span className={`online chatStatuNow`}></span>
                            <img src={avatar1} alt="avatar-1" />
                        </div>
                        <div className="yourContactInfo">
                            <h1>
                                Name here
                            </h1>
                            <p>
                                email1234@email.com
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
                                <div onClick={()=>{navigate(`/your-messages/${item?.id}`)}} key={index} className={`messageChatItem ${item.activeHover}` }>
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
