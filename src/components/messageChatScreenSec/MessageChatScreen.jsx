import React, { useEffect, useRef, useState } from 'react'
import './messageChatScreen.css'
import avatar3 from '../../assets/messageImages/Avatar3.png'
import avatar1 from '../../assets/messageImages/Ellipse 159.png'
import send from '../../assets/messageImages/send.png'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'

export default function MessageChatScreen({ loginType, messages, token, activeChat, loadOlderMessages, hasMore, loadingActiveChat, chatSettings, fireMessage, setFireMessage }) {
    const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            message: '',
            attachments: [],
            chat_code: ''
        },
    });
    const [attachmentsPreview, setAttachmentsPreview] = useState([]);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleScroll = () => {
        if (chatContainerRef.current.scrollTop === 0 && hasMore) {
            loadOlderMessages();
        }
    };
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        chatContainer.addEventListener('scroll', handleScroll);
        return () => chatContainer.removeEventListener('scroll', handleScroll);
    }, [hasMore]);


    const handleIconClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setValue('attachments', files);
        setAttachmentsPreview(files);
    };

    // const sendMessage = async (data) => {
    //     if (!data.message && (!data.attachments || data.attachments.length === 0)) {
    //         toast.error('Please provide a message or add an attachment.');
    //         return;
    //     }
    //     const toastId = toast.loading('Sending message...');
    //     const formData = new FormData();
    //     if (chatSettings?.code) {
    //         formData.append('chat_code', chatSettings.code);
    //     }
    //     if (data.message) {
    //         formData.append('message', data.message);
    //     }
    //     if (Array.isArray(data.attachments) && data.attachments.length > 0) {
    //         data.attachments.forEach((file) => {
    //             formData.append('attachments[]', file);
    //         });
    //     }

    //     try {
    //         const res = await axios.post(`${baseURL}/${loginType}/send-new-message?t=${new Date().getTime()}`, formData, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'multipart/form-data',
    //                 'Authorization': `Bearer ${token}`,
    //             }
    //         })
    //         console.log(res?.data?.message);
    //         toast.success(res?.data?.message || 'Message sent successfully', {
    //             id: toastId,
    //             duration: 1000
    //         });
    //         setAttachmentsPreview([]);
    //         setValue('message', '');
    //         setValue('attachments', []);
    //         setFireMessage(true)
    //     } catch (error) {
    //         console.log(error?.response?.data);
    //         toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
    //             id: toastId,
    //             duration: 1000
    //         });
    //     };
    // };

    const sendMessage = async (data) => {
        if (!data.message && (!data.attachments || data.attachments.length === 0)) {
            toast.error('Please provide a message or add an attachment.');
            return;
        }
        const formData = new FormData();
        if (chatSettings?.code) {
            formData.append('chat_code', chatSettings.code);
        }
        if (data.message) {
            formData.append('message', data.message);
        }
        if (Array.isArray(data.attachments) && data.attachments.length > 0) {
            data.attachments.forEach((file) => {
                formData.append('attachments[]', file);
            });
        }
    
        const maxRetries = 5; // Maximum number of retries
        let attempt = 0;
        let delay = 1000; // Initial delay in milliseconds
    
        while (attempt < maxRetries) {
            const toastId = toast.loading('Sending message...');
    
            try {
                const res = await axios.post(`${baseURL}/${loginType}/send-new-message?t=${new Date().getTime()}`, formData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                toast.success(res?.data?.message || 'Message sent successfully', { id: toastId, duration: 1000 });
                setAttachmentsPreview([]);
                setValue('message', '');
                setValue('attachments', []);
                setFireMessage(true); 
                break; 
    
            } catch (error) {
                toast.dismiss(toastId); 
                if (error.response?.status === 429) { 
                    attempt++;
                    toast.error(`Too many attempts. Retrying in ${delay / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; 
    
                } else {
                    toast.error(error?.response?.data?.message || 'Something Went Wrong!');
                    break; 
                }
            }
        }
    
        // If all retries are exhausted
        if (attempt === maxRetries) {
            toast.error('Maximum retry limit reached. Please try again later.');
        }
    };
    useEffect(() => {
        if (fireMessage) {
            setFireMessage(false);
        }
    }, [fireMessage]);
    return (
        <div className='messageChatScreen__handler'>
            <div className="container">
                <div className="messageChat__mainInfo">
                    <div className="yourAvatarImage">
                        <span className={`online chatStatuNow`}></span>
                        <img src={chatSettings?.receiverImage} alt="avatar-1" />
                    </div>
                    <div className="yourContactInfo">
                        <h1>
                            {chatSettings?.receiverName}
                        </h1>
                        <p>
                            {chatSettings?.receiverEmail}
                        </p>
                    </div>
                </div>
                <div ref={chatContainerRef} className="chatApperance__contents d-flex flex-column-reverse">
                    {
                        messages?.map((message, idx) => (
                            <>
                                <div key={idx} className={`${message?.authType === "sender" ? "mySendig__chat__messages" : 'replaied__user__message'} mb-3`}>
                                    <div className="direction__of__message">
                                        {message?.authType === "sender" ?
                                            <>
                                                <div className="message__item">
                                                    {message?.type === 'text' && (
                                                        <p>
                                                            {message?.message}

                                                        </p>
                                                    )
                                                    }
                                                    {message?.type === 'image' && (
                                                        <img style={{ width: '100px', height: "100px", borderRadius: "8px" }} src={message?.message} alt="" />
                                                    )
                                                    }
                                                    {message?.type === 'audio' && (
                                                        <audio controls>
                                                            <source src={message?.message} type="audio/mpeg" />
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    )}
                                                    {message?.type === 'video' && (
                                                        <video style={{ width: '100px', height: "100px", borderRadius: "8px" }} controls>
                                                            <source src={message?.message} type="video/mp4" />
                                                            Your browser does not support the video element.
                                                        </video>
                                                    )}
                                                    {message?.type === 'file' && (
                                                        <a href={message?.message} target="_blank" rel="noopener noreferrer" download>
                                                            Download File
                                                        </a>
                                                    )}
                                                    <div className="message__item__img">
                                                        {
                                                            message?.authType === "sender" && (
                                                                <img src={message?.authImg} alt="" />
                                                            )
                                                        }
                                                        {
                                                            message?.authType === "receiver" && (
                                                                <img src={message?.senderImg} alt="" />
                                                            )
                                                        }

                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="message__item">
                                                    <div className="message__item__img">
                                                        {
                                                            message?.authType === "sender" && (
                                                                <img src={message?.authImg} alt="" />
                                                            )
                                                        }
                                                        {
                                                            message?.authType === "receiver" && (
                                                                <img src={message?.senderImg} alt="" />
                                                            )
                                                        }

                                                    </div>
                                                    {message?.type === 'text' && (
                                                        <p>
                                                            {message?.message}
                                                        </p>
                                                    )
                                                    }
                                                    {message?.type === 'image' && (
                                                        <img style={{ width: '100px', height: "100px", borderRadius: "8px" }} src={message?.message} alt="" />
                                                    )
                                                    }
                                                    {message?.type === 'audio' && (
                                                        <audio controls>
                                                            <source src={message?.message} type="audio/mpeg" />
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    )}
                                                    {message?.type === 'video' && (
                                                        <video style={{ width: '100px', height: "100px", borderRadius: "8px" }} controls>
                                                            <source src={message?.message} type="video/mp4" />
                                                            Your browser does not support the video element.
                                                        </video>
                                                    )}
                                                    {message?.type === 'file' && (
                                                        <a href={message?.message} target="_blank" rel="noopener noreferrer" download>
                                                            Download File
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        }

                                        <div className="timeOfMessage">
                                            <p>{message?.sent_at}</p>
                                        </div>
                                    </div>

                                </div>
                            </>
                        ))
                    }
                    {
                        hasMore && (
                            <div className="w-100 d-flex justify-content-center spannerContainer">
                                <div className="loader">
                                    <div className="bar1"></div>
                                    <div className="bar2"></div>
                                    <div className="bar3"></div>
                                    <div className="bar4"></div>
                                    <div className="bar5"></div>
                                    <div className="bar6"></div>
                                    <div className="bar7"></div>
                                    <div className="bar8"></div>
                                    <div className="bar9"></div>
                                    <div className="bar10"></div>
                                    <div className="bar11"></div>
                                    <div className="bar12"></div>
                                </div>
                            </div>
                        )

                    }
                </div>
                <div className="chatTextField__actions position-relative">
                    <form onSubmit={handleSubmit(sendMessage) } className='chatFormContents'>
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

                    <div className="attachment-previews position-relative mt-3">
                        {attachmentsPreview.map((file, index) => {
                            const fileType = file.type.split('/')[0];
                            return (
                                <div key={index} className="attachment-preview">
                                    {fileType === 'image' && <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '50px', height: '50px' }} />}
                                    {fileType === 'audio' && <audio controls src={URL.createObjectURL(file)} />}
                                    {fileType === 'video' && <video controls style={{ width: '50px', height: '50px' }} src={URL.createObjectURL(file)} />}
                                    {fileType !== 'image' && fileType !== 'audio' && fileType !== 'video' && (
                                        <p>{file.name}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
