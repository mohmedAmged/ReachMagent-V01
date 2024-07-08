import React from 'react'
import './userChatSidebar.css'
import avatar1 from '../../assets/messageImages/Avatar1.png'
import avatar2 from '../../assets/messageImages/Avatar2.png'
import avatar3 from '../../assets/messageImages/Avatar3.png'

export default function UserChatSidebar() {
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
    ]
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
                    <div className="yourStatusInfo">
                        <select name="" id="">
                            <option value="" disabled>change Status</option>
                            <option value="">online</option>
                            <option value="">offline</option>
                        </select>
                    </div>
                </div>
                <div className="yourSearchUsers">
                    <div className="form__part input__search__part">
                        <i className="bi bi-search"></i>
                        <input type="text" placeholder='Search...' />
                    </div>
                </div>
                <div className="yourChatsPart">
                    {
                        messgaeChatsItems?.map((item, index) => {
                            return (
                                <div key={index} className={`messageChatItem ${item.activeHover}`}>
                                    <div className="messageChatMainInfo">
                                        <div className="messageChatImg">
                                            <span className={`${item.chatStatu} chatStatuNow`}></span>
                                            <img src={item.chatImg} alt="avatar-2" />
                                        </div>
                                        <div className="messageChatInfo">
                                            <div className="messageChatName">
                                                <h3>
                                                    {item.chatName}
                                                </h3>
                                            </div>
                                            <div className="messageChatContent">
                                                <p>
                                                    {item.chatMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="timeOfMessage">
                                        <span>{item.messageTime}</span>
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
