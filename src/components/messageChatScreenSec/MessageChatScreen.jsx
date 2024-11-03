import React, { useRef } from 'react'
import './messageChatScreen.css'
import avatar3 from '../../assets/messageImages/Avatar3.png'
import avatar1 from '../../assets/messageImages/Ellipse 159.png'
import send from '../../assets/messageImages/send.png'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'

export default function MessageChatScreen({ loginType, messagees, token, activeChat }) {
    const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            message: '',
            attachments: '',
        },
    });

    const fileInputRef = useRef(null);
    const handleIconClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        const files = event.target.files;
        setValue('attachments', Array.from(files));
    };

    const sendMessage = async (data) => {
        if (data?.message.length > 0 || data?.attachments.length > 0) {
            // const toastId = toast.loading('Sending message...');
            data.chat_code = activeChat;
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                if (key !== 'attachments') {
                    formData.append(key, data[key]);
                } else {
                    data.attachments.forEach((file) => {
                        formData.append('attachments', file);
                    });
                };
            });

            // try {
            //     const res = await axios.post(`${baseURL}/${loginType}/send-new-message?t=${new Date().getTime()}`, formData, {
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-Type': 'multipart/form-data',
            //             'Authorization': `Bearer ${token}`,
            //         }
            //     })
            //     console.log(res?.data?.message);
            //     toast.success(res?.data?.message || 'Message sent successfully', {
            //         id: toastId,
            //         duration: 1000
            //     });
            // } catch (error) {
            //     console.log(error?.response?.data);
            //     toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
            //         id: toastId,
            //         duration: 1000
            //     });
            // };
        };
    };

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
                <div className="chatTextField__actions position-relative">
                    <form onSubmit={handleSubmit(sendMessage)} className='chatFormContents'>
                        <div className="fileHandler">
                            <input
                                type="file"
                                className="form-control d-none"
                                multiple={true}
                                placeholder="Attach a file..."
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <i
                                className="bi bi-paperclip cursorPointer"
                                onClick={handleIconClick}
                                title="Attach a files"
                            ></i>
                        </div>
                        <input
                            type="text"
                            className='form-control px-5'
                            placeholder='Type your message here...'
                            {...register('message')}
                        />
                        <button disabled={isSubmitting} className="send__btn">
                            <img src={send} alt="" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
