import React, { useEffect, useState } from 'react';
import './myMessage.css';
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar';
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import useMessaging from '../../functions/useMessaging';
import { useParams } from 'react-router-dom';

export default function MyMessage({ token, loginnedUserId }) {
    const loginType = localStorage.getItem('loginType');
    const { activeChatId } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(activeChatId);
    const [messages, setMessages] = useState([]);
    const [loadingActiveChat, setLoadingActiveChat] = useState(false);
    const [loadingAllChats, setLoadingAllChats] = useState(false);

    const getAllChats = async () => {
        try {
            setLoadingAllChats(true);
            const slug = loginType === 'user' ? 'my-chats' : 'company-chats';
            const res = await axios.get(`${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChats(res?.data?.data?.chats);
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load chats');
        };
        setLoadingAllChats(false);
    };

    useEffect(() => {
        if (token && loginType) {
            getAllChats();
        };
    }, [token, loginType, messages]);

    const showActiveChat = async () => {
        setLoadingActiveChat(true);
        try {
            const res = await axios.post(`${baseURL}/${loginType}/get-chat?t=${new Date().getTime()}`, {
                chat_id: activeChatId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res?.data?.data);
            setMessages(res?.data?.data);
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load messages');
        } finally {
            setLoadingActiveChat(false);
        };
    };

    useEffect(() => {
        if (activeChatId) {
            showActiveChat();
        };
    }, [activeChatId, activeChat]);

    useMessaging(token, loginType, activeChat, loginnedUserId);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className='myMessage__handler'>
                    <div className="container">
                        <div className="myMessage__mainContent">
                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-sm-12">
                                    <div className="userChat__sidebar">
                                        <UserChatSidebar chats={chats} setActiveChat={setActiveChat} />
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-12">
                                    <MessageChatScreen loginType={loginType} token={token} messages={messages} activeChat={activeChat} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
