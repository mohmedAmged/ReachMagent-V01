import React, { useEffect, useState } from 'react'
import './myMessage.css'
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar'
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen'
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function MyMessage({ token }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    // const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     const pusher = new Pusher('9b5d478389d4bbf7919c', {
    //         cluster: 'ap2',
    //         authEndpoint: `${baseURL}/user/pusher/auth`,
    //         auth: {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         },
    //     });
    //     Pusher.logToConsole = false;
    //     const channel = pusher.subscribe('');
    //     channel.bind('message', (data) => {
    //         setMessages((prevMessages) => [...prevMessages, data]);
    //     });
    //     return () => {
    //         channel.unbind_all();
    //         channel.unsubscribe();
    //         pusher.disconnect();
    //     };
    // }, []);

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
