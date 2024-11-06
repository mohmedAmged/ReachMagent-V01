import React, { useEffect, useState } from 'react';
import './myMessage.css';
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar';
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import useMessaging from '../../functions/useMessaging';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithCache, rateLimiter } from '../../functions/requestUtils';
import toast from 'react-hot-toast';

export default function MyMessage({ token, loginnedUserId, fireMessage, setFireMessage }) {
    const loginType = localStorage.getItem('loginType');
    const { activeChatId } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(activeChatId);
    const [messages, setMessages] = useState([]);
    const [chatSettings, setChatSettings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingActiveChat, setLoadingActiveChat] = useState(false);
    const [loadingAllChats, setLoadingAllChats] = useState(false);
    const [userNowInfo, setUserNowInfo] = useState([]);
    const [firstRender,setFirstRender] = useState(true);
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
            setUserNowInfo(res?.data?.data?.user);
            setFireMessage(false);

        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load chats');
        };
        setLoadingAllChats(false);
    };


    const showActiveChat = async (page = 1) => {
        setLoadingActiveChat(true);
        try {
            const res = await axios.get(`${baseURL}/${loginType}/get-chat/${activeChatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page,
                    t: new Date().getTime()
                },
            });
            const newMessages = res?.data?.data?.messages.messages;
            setChatSettings(res?.data?.data?.chat)
            setMessages((prevMessages) => page === 1 ? newMessages : [...prevMessages, ...newMessages ]);
            setHasMore(res?.data?.data?.messages?.meta?.current_page < res?.data?.data?.messages?.meta?.last_page);
            setCurrentPage(page);
            setFireMessage(false);
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load messages');
        } finally {
            setLoadingActiveChat(false);
        };
    };
    
    // useEffect(() => {
    //         showActiveChat();
    // }, [fireMessage, activeChatId]);

    useEffect(() => {
        // Only fetch messages if activeChatId has changed or fireMessage is set to true
        if (activeChatId && token) {
            showActiveChat();
        }
    }, [fireMessage, activeChatId, token]);

    const navigate = useNavigate();
    useEffect(()=>{
        if(firstRender){
            navigate('/your-messages');
            setFirstRender(false);
        };
    },[]);


    useEffect(() => {
        if (token && loginType) {
            getAllChats();
        }
    }, [token, loginType, fireMessage]);
    

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
                                        <UserChatSidebar chats={chats} setActiveChat={setActiveChat} userNowInfo={userNowInfo}
                                        activeChatId={activeChatId}
                                        />
                                    </div>
                                </div>
                                {
                                    activeChatId && (
                                        <div className="col-lg-8 col-md-8 col-sm-12">
                                            <MessageChatScreen
                                                loginType={loginType} token={token} messages={messages} activeChat={activeChat}
                                                loadOlderMessages={() => showActiveChat(currentPage + 1)}
                                                hasMore={hasMore}
                                                chatSettings={chatSettings}
                                                loadingActiveChat={loadingActiveChat}
                                                fireMessage={fireMessage}
                                                setFireMessage={setFireMessage}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
