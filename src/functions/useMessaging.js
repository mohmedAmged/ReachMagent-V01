import Pusher from 'pusher-js';
import { useRef } from 'react';
import { baseURL } from './baseUrl';

export default function useMessaging( token, loginType, activeChat, loginnedUserId, setFireMessage ) {
    const isEventBound = useRef(false);
    if (token && loginType && activeChat  && loginnedUserId) {
        const pusher = new Pusher('9b5d478389d4bbf7919c', {
            cluster: 'ap2',
            authEndpoint: `${baseURL}/user/pusher/auth`,
            auth: {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            
        });
        Pusher.logToConsole = false;
        const channelName = `private-chat-notification-${loginType === 'user' ? 'User' : 'Employee'}${loginnedUserId}`;
        const channel = pusher.subscribe(channelName);
        if (!isEventBound.current) {
            channel.bind('chat-notification-event', (data) => {
                console.log("New message received:", data);
                setFireMessage(true);
            });
            isEventBound.current = false;
        };
    };
};
