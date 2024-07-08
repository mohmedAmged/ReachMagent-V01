import React from 'react'
import './myMessage.css'
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar'
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen'
export default function MyMessage() {
  return (
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
  )
}
