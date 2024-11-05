import React, { useEffect, useState } from 'react';
import './myMessage.css';
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar';
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import useMessaging from '../../functions/useMessaging';
import { useParams } from 'react-router-dom';
import { fetchWithCache, rateLimiter } from '../../functions/requestUtils';
import toast from 'react-hot-toast';

export default function MyMessage({ token, loginnedUserId }) {
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
    const [fireMessage, setFireMessage] = useState(false);
    const [userNowInfo, setUserNowInfo] = useState([]);

    useMessaging(token, loginType, activeChat, loginnedUserId, setFireMessage);



    // const getAllChats = async () => {
    //     try {
    //         setLoadingAllChats(true);
    //         const slug = loginType === 'user' ? 'my-chats' : 'company-chats';
    //         const res = await axios.get(`${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         setChats(res?.data?.data?.chats);
    //     } catch (error) {
    //         setError(error?.response?.data?.message || 'Failed to load chats');
    //     };
    //     setLoadingAllChats(false);
    // };

    const getAllChats = async () => {
        const slug = loginType === 'user' ? 'my-chats' : 'company-chats';
        const endpoint = `${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`;

        // Use rateLimiter to prevent too many requests
        if (!rateLimiter('getAllChats')) {
            setError('Too many requests. Please try again later.');
            return;
        }

        try {
            setLoadingAllChats(true);

            // Use fetchWithCache to retrieve data, with caching enabled for 1 minute
            const data = await fetchWithCache(endpoint, async () => {
                const res = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return res?.data?.data;
            });

            setChats(data?.chats);
            setUserNowInfo(data?.user)
            setFireMessage(false)
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load chats');
        } finally {
            setLoadingAllChats(false);
        }
    };
console.log(userNowInfo);

    // useEffect(() => {
    //     if (token && loginType) {
    //         getAllChats();
    //     };
    // }, [token, loginType, messages, fireMessage]);

    // const showActiveChat = async (page = 1) => {
    //     setLoadingActiveChat(true);
    //     try {
    //         const res = await axios.post(`${baseURL}/${loginType}/get-chat?t=${new Date().getTime()}`, {
    //             chat_id: activeChatId,
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             params: {
    //                 page,
    //             },
    //         });
    //         // console.log(res?.data?.data);
    //         // setMessages(res?.data?.data);
    //         const newMessages = res?.data?.data?.messages.messages;
    //         setChatSettings(res?.data?.data?.chat)
    //         setMessages((prevMessages) => page === 1 ? newMessages : [...prevMessages, ...newMessages, ]);
    //         setHasMore(res?.data?.data?.messages?.meta?.current_page < res?.data?.data?.messages?.meta?.last_page);
    //         setCurrentPage(page);
    //     } catch (error) {
    //         setError(error?.response?.data?.message || 'Failed to load messages');
    //     } finally {
    //         setLoadingActiveChat(false);
    //     };
    //     setFireMessage(false)
    // };

    const showActiveChat = async (page = 1) => {
        const endpoint = `${baseURL}/${loginType}/get-chat?t=${new Date().getTime()}`;

        // Apply rate limiting to control frequency of requests
        if (!rateLimiter('showActiveChat')) {
            toast.error('You are taking actions too quickly. Please wait a moment.');
            return;
        }

        setLoadingActiveChat(true);
        try {
            const res = await axios.post(endpoint, {
                chat_id: activeChatId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { page },
            });

            const newMessages = res?.data?.data?.messages?.messages;
            setChatSettings(res?.data?.data?.chat);
            setMessages((prevMessages) => page === 1 ? newMessages : [...prevMessages, ...newMessages]);
            setHasMore(res?.data?.data?.messages?.meta?.current_page < res?.data?.data?.messages?.meta?.last_page);
            setCurrentPage(page);
            setFireMessage(true)
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load messages');

        } finally {
            setLoadingActiveChat(false);
        }
    };
    console.log(fireMessage);
    
    useEffect(() => {
            showActiveChat();
            setFireMessage(false); // Reset fireMessage after fetching
        
    }, [fireMessage]);

    useEffect(() => {
        if (token && loginType) {
            getAllChats();
            showActiveChat();
        }
    }, [token, loginType, activeChatId, fireMessage]);
    

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    console.log(messages);

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
