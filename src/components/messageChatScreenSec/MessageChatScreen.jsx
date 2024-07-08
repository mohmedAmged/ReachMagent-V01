import React from 'react'
import './messageChatScreen.css'
import avatar3 from '../../assets/messageImages/Avatar3.png'
import avatar1 from '../../assets/messageImages/Ellipse 159.png'
import avatar2 from '../../assets/messageImages/Ellipse 2.png'
import send from '../../assets/messageImages/send.png'

export default function MessageChatScreen() {
    return (
        <div className='messageChatScreen__handler'>
            <div className="container">
                <div className="messageChat__mainInfo">
                    <div className="yourAvatarImage">
                        <span className={`online chatStatuNow`}></span>
                        <img src={avatar3} alt="avatar-1" />
                    </div>
                    <div className="yourContactInfo">
                        <h1>
                            jumia
                        </h1>
                        <p>
                            email1234@email.com
                        </p>
                    </div>
                </div>
                <div className="chatApperance__contents">
                    <div className="mySendig__chat__messages">
                        <div className="direction__of__message">
                            <div className="message__item">
                                <p>
                                    Lorem ipsum dolor sit amet Lorem ips??
                                </p>
                                <div className="message__item__img">
                                    <img src={avatar1} alt="avatar-1" />
                                </div>
                            </div>
                            <div className="message__item">
                                <p>
                                    Lorem ipsum dolor sit am
                                </p>
                                <div className="message__item__img">
                                    <img src={avatar1} alt="avatar-1" />
                                </div>
                            </div>
                            <div className="timeOfMessage">
                                <p>9:12 PM</p>
                            </div>
                        </div>

                    </div>
                    <div className="replaied__user__message">
                        <div className="direction__of__message">
                            <div className="message__item">
                                <div className="message__item__img">
                                    <img src={avatar3} alt="avatar-1" />
                                </div>
                                <p>
                                    Save  thousands to millions of bucks by using single tool for different. amazing and outstanding cool and great useful
                                </p>
                            </div>
                            <div className="timeOfMessage">
                                <p>9:18 PM</p>
                            </div>
                        </div>
                    </div>
                    <div className="mySendig__chat__messages">
                        <div className="direction__of__message">
                            <div className="message__item">
                                <p>
                                    Lorem ipsum dolor sit amet Lorem ips??
                                </p>
                                <div className="message__item__img">
                                    <img src={avatar1} alt="avatar-1" />
                                </div>
                            </div>
                            <div className="message__item">
                                <p>
                                    Lorem ipsum dolor sit am
                                </p>
                                <div className="message__item__img">
                                    <img src={avatar1} alt="avatar-1" />
                                </div>
                            </div>
                            <div className="timeOfMessage">
                                <p>9:18 PM</p>
                            </div>
                        </div>
                    </div>
                    <div className="replaied__user__message">
                        <div className="direction__of__message">
                            <div className="message__item">
                                <div className="message__item__img">
                                    <img src={avatar3} alt="avatar-1" />
                                </div>
                                <p>
                                    Save  thousands to millions of bucks by using single tool for different. amazing and outstanding cool and great useful
                                </p>
                            </div>
                            <div className="timeOfMessage">
                                <p>9:18 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chatTextField__actions">
                    <form action="" className='chatFormContents'>
                        <input type="text" />
                        <div className="send__btn">
                            <img src={send} alt="" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
