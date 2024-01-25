import React, { useEffect, useState, useRef } from 'react'
import { BiSearch} from "react-icons/bi";

import {BsThreeDots} from "react-icons/bs";
import {FaEdit } from "react-icons/fa";
import {  IoLogOutOutline } from "react-icons/io5";

import Friends from './Friends';
import RightSide from './RightSide';
import { io } from "socket.io-client";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { getFriends, messageSend, getMessage, ImageMessageSend, seenMessage, updateMessage, getTheme, themeSet } from "../store/actions/messengerAction";
import { userLogout } from "../store/actions/authAction";
import useSound from 'use-sound';
import notificationSound from '../audio/notification.mp3';
import sendingSound from '../audio/sending.mp3';

const Messenger = () => {

    const [notificationSPlay] = useSound(notificationSound);
    const [sendingSPlay] = useSound(sendingSound);
    const { myInfo } = useSelector(state => state.auth);
    const { friends, message, messageSendSuccess, message_get_success, themeMood,new_user_add} = useSelector(state => state.messenger);

    const [currentfriend, setCurrentFriend] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [socketMessage, setSocketMessage] = useState('');
    const [typingMessage, setTypingMessage] = useState('')

    const [activeUser, setActiveUser] = useState([]);

    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io('ws://localhost:8000');
        socket.current.on('getMessage', (data) => {
            setSocketMessage(data);
        })
        socket.current.on('typingMessageGet', (data) => {
            setTypingMessage(data);
        })
        socket.current.on('msgSeenResponse', msg => {

            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })
        socket.current.on('msgDelivaredResponse', msg => {
            dispatch({
                type: 'DELIVARED_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })
        socket.current.on('seenSuccess', data => {
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
        })
    }, []);
    useEffect(() => {
        socket.current.emit('addUser', myInfo.id, myInfo)
    }, []);

    useEffect(() => {
        socket.current.on('getUser', (users) => {
            const filterUser = users.filter(u => u.userId !== myInfo.id);
            setActiveUser(filterUser);
        });
        socket.current.on('new_user_add',data=>{
            dispatch({
                type : 'NEW_USER_ADD',
                payload : {
                    new_user_add :data 
                }
            })
        })
    }, [])

    useEffect(() => {
        if (socketMessage && currentfriend) {
            if (socketMessage.senderId === currentfriend._id && socketMessage.reseverId === myInfo.id) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })

                dispatch(seenMessage(socketMessage));
                socket.current.emit('messageSeen', socketMessage);
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        msgInfo: socketMessage,
                        status: 'seen'
                    }
                })
            }

        }
        setSocketMessage('')
    }, [socketMessage])

    useEffect(() => {
        if (socketMessage && socketMessage.senderId !== currentfriend._id && socketMessage.reseverId === myInfo.id) {
            notificationSPlay();
            toast.success(`${socketMessage.senderName} send a new message`)
            dispatch(updateMessage(socketMessage));
            socket.current.emit('delivaredMessage', socketMessage);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: socketMessage,
                    status: 'delivared'
                }
            })
        }
    }, [socketMessage])

    const inputHendle = (e) => {
        setNewMessage(e.target.value);

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: e.target.value
        })
    }
    const sendMessage = (e) => {
        e.preventDefault();
        sendingSPlay();
        const data = {
            senderName: myInfo.userName,
            reseverId: currentfriend._id,
            message: newMessage ? newMessage : '❤️'
        }

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: ''
        })
        dispatch(messageSend(data));
        setNewMessage('')
    }

    const emojiSend = (emu) => {
        setNewMessage(`${newMessage}` + emu);
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: emu
        })
    }

    const ImageSend = (e) => {
        if (e.target.files.length !== 0) {
            sendingSPlay();
            const imagename = e.target.files[0].name;
            const newImageName = Date.now() + imagename;

            const formData = new FormData();

            formData.append('senderName', myInfo.userName);
            formData.append('imageName', newImageName);
            formData.append('reseverId', currentfriend._id);
            formData.append('image', e.target.files[0]);

            dispatch(ImageMessageSend(formData));

        }

    }

    const dispatch = useDispatch();

    useEffect(() => {
        if (messageSendSuccess) {
            socket.current.emit('sendMessage', message[message.length - 1]);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: message[message.length - 1]
                }
            })
            dispatch({ type: 'MESSAGE_SEND_SUCCESS_CLEAR' })
        }
    }, [messageSendSuccess])
    useEffect(() => {
        dispatch(getFriends());
        dispatch({type : 'NEW_USER_ADD_CLEAR'})
    }, [new_user_add]);

    useEffect(() => {
        if (friends && friends.length > 0) {
            setCurrentFriend(friends[0].fndInfo);
        }
    }, [friends])

    useEffect(() => {
        dispatch(getMessage(currentfriend._id));
    }, [currentfriend?._id])

    useEffect(() => {
        if (message.length > 0) {
            if (message[message.length - 1].senderId !== myInfo.id && message[message.length - 1].status !== 'seen') {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        id: currentfriend._id
                    }
                })
                socket.current.emit('seen', { senderId: currentfriend._id, reseverId: myInfo.id });
                dispatch(seenMessage({ _id: message[message.length - 1]._id }))
            }
        }
        dispatch({
            type: 'MESSAGE_GET_SUCCESS_CLEAR'
        })
    }, [message_get_success])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [message]);

    const [hide, setHide] = useState(true);

    const logout = () => {
        dispatch(userLogout());
        socket.current.emit('logout', myInfo.id);
    }
    useEffect(() => {
        dispatch(getTheme());
    }, []);

    const search = (e) => {

        const getFriendClass = document.getElementsByClassName('hover-friend');
        const frienNameClass = document.getElementsByClassName('Fd_name');
        for (var i = 0; i < getFriendClass.length, i < frienNameClass.length; i++) {
            let text = frienNameClass[i].innerText.toLowerCase();
            if (text.indexOf(e.target.value.toLowerCase()) > -1) {
                getFriendClass[i].style.display = '';
            } else {
                getFriendClass[i].style.display = 'none';
            }
        }
    }
    return (
        <div className={themeMood === 'dark' ? 'messenger theme' : 'messenger'}>
            <Toaster
                position={'top-right'}
                reverseOrder={false}
                toastOptions={{
                    style: {
                        fontSize: '18px'
                    }
                }}
            />
            <div className="row">
                <div className="col-3">
                    <div className="left-side">
                        <div className="top">
                            <div className="image-name">
                                <div className="image">
                                    <img src={`./image/${myInfo.image}`} alt="" />
                                </div>
                                <div className="name">
                                    <h3>{myInfo.userName}</h3>
                                </div>
                            </div>
                            <div className="icons">
                                <div onClick={() => setHide(!hide)} className="icon">
                                    <BsThreeDots />
                                </div>
                                <div className="icon">
                                    <FaEdit />
                                </div>
                                <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                                    <h3>Dark Mode</h3>
                                    <div className="on">
                                        <label htmlFor="dark">ON</label>
                                        <input onChange={(e) => dispatch(themeSet(e.target.value))} value='dark' type="radio" name='theme' id='dark' />
                                    </div>

                                    <div className="of">
                                        <label htmlFor="white">OFF</label>
                                        <input onChange={(e) => dispatch(themeSet(e.target.value))} value='white' type="radio" name='theme' id='white' />
                                    </div>
                                    <div onClick={logout} className="logout">
                                        <IoLogOutOutline />Logout
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="friend-search">
                            <div className="search">
                                <button><BiSearch /></button>
                                <input onChange={search} type="text" placeholder='search' className="form-control" />
                            </div>
                        </div>
                        {/*<div className="active-friends">
                            {
                                activeUser && activeUser.length > 0 ? activeUser.map(u => <ActiveFriend setCurrentFriend={setCurrentFriend} user={u} />) : ''
                            }

                        </div>*/}
                        <div className="friends">
                            {
                                friends && friends.length > 0 ? friends.map((fd,index) => <div key={index} onClick={() => setCurrentFriend(fd.fndInfo)} className={currentfriend._id === fd.fndInfo._id ? 'hover-friend active' : 'hover-friend'}>
                                    <Friends activeUser={activeUser} myId={myInfo.id} friend={fd} />
                                </div>) : 'no friend'
                            }

                        </div>
                    </div>
                </div>
                {
                    currentfriend ? <RightSide
                        activeUser={activeUser}
                        ImageSend={ImageSend}
                        currentfriend={currentfriend}
                        inputHendle={inputHendle}
                        newMessage={newMessage}
                        sendMessage={sendMessage}
                        message={message}
                        scrollRef={scrollRef}
                        emojiSend={emojiSend}
                        typingMessage={typingMessage}
                    /> : 'Please select you friend'
                }

            </div>
        </div>
    )
}

export default Messenger
