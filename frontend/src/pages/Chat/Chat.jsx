import { useContext, useEffect, useState } from 'react';
import ChatSideBar from '../../components/chat/ChatSideBar';
import { Container, Sidebar } from 'rsuite';
import ChatBody from '../../components/chat/ChatBody';
import { useLocation } from "react-router-dom";
import { formattedRoom } from "../../components/chat/ChatSideBar";
import AuthContext from '../../context/AuthContext';
import ServerUrl from '../../api/ServerUrl';

export default function Chat() {
    const {user} = useContext(AuthContext)
    const [onlineUser, setOnlineUser] = useState([])
    const [currentUser, setCurrentUser] = useState()
    const fetchOnlineUser = async () => {
        let res = await fetch(ServerUrl.BASE_URL + "online-user/")
        let data = await res.json()
        setOnlineUser(data)
    }

    const location = useLocation()
    
    useEffect(() => {
        fetchOnlineUser()
        if (location.state) {
            let room = formattedRoom(location.state.room, onlineUser, user)[0]
            setCurrentUser(room)
        }
    }, [])

    return (
        <Container className='chat'>
            <Sidebar>
                <ChatSideBar onlineUser={onlineUser} setCurrentUser={setCurrentUser} />
            </Sidebar>
            <ChatBody currentUser={currentUser} setOnlineUser={setOnlineUser} />
        </Container>
    )
}
