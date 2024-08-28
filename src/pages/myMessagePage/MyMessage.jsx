import React, { useEffect, useState } from 'react'
import './myMessage.css'
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar'
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen'
import MyLoader from '../../components/myLoaderSec/MyLoader';
export default function MyMessage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='myMessage__handler'>
                        <div className="container">
                            <div className="myMessage__mainContent">
                                <div className="row">
                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                        <div className="userChat__sidebar">
                                            <UserChatSidebar />
                                        </div>
                                    </div>
                                    <div className="col-lg-8 col-md-8 col-sm-12">
                                        <MessageChatScreen />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
