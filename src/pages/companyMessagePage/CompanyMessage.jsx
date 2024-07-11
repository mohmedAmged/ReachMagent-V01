import React from 'react'
import './companyMessage.css'
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar'
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen'
import EmployeeChatSidebar from '../../components/employeeChatSidebarMainSec/EmployeeChatSidebar'
export default function CompanyMessage() {
  return (
    <div className='companyMessage__handler myMessage__handler'>
        <div className="container">
            <div className="companyMessage__mainContent">
                <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <UserChatSidebar />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <MessageChatScreen />
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <EmployeeChatSidebar/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
