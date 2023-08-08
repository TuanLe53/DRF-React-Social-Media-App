import { useContext, useEffect, useState } from "react"
import AuthContext from "../../context/AuthContext"
import { Button, Container, Content, Footer, Header, IconButton, Stack, Tooltip, Whisper } from "rsuite"
import Avatar from "react-avatar"
import SendIcon from '@rsuite/icons/Send';
import Picker from 'emoji-picker-react';
import ServerUrl from "../../api/ServerUrl";

export default function ChatBody({currentUser, setOnlineUser}) {
    const { user } = useContext(AuthContext)
    const [ws, setWs] = useState()
    let room = currentUser ? currentUser : null
    

    const [messages, setMessages] = useState([])
    const getMessageClassName = (userId) => {
        return userId === user.user_id 
            ? "message-right"
            : "message-left"
    }
    const fetchMessage = async () => {
        let res = await fetch(ServerUrl.API_URL + `chat/${room?.roomId}/messages/`)
        let data = await res.json()
        setMessages(data)
    }

    const connect = () => {
        let socket = new WebSocket(ServerUrl.WS_URL + `users/${user.user_id}/chat/`)
        setWs(socket)
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const roomId = room?.roomId;
            if (roomId === data.roomId) {
                if (data.action === "message") {
                    setMessages((prevState) => {
                        let messageState = JSON.parse(JSON.stringify(prevState));
                        messageState.unshift(data)
                        return messageState
                    })
                }
            }
            if (data.action === "onlineUser") {
                setOnlineUser(data.userList)
            }
        }
    }

    useEffect(() => {
        fetchMessage()
        connect()
    }, [currentUser])

    return (
        <Container className="chat-body">
            {room
                ?
                <>
                    <Header>
                        <Stack>
                            <Avatar src={ServerUrl.BASE_URL + room?.image} round={true} size="40" />
                            <h3>{room?.name}</h3>
                        </Stack>
                    </Header>
                    <Content>
                        {messages?.map((message) => (
                            <div className={getMessageClassName(message.user)}>
                                <Avatar src={ServerUrl.BASE_URL + message.userImage} round={true} size="40" />
                                <div>
                                    <p className="message-user">{message.userName}</p>
                                    <p className="message">{message.message}</p>
                                </div>
                            </div>
                        ))}
                    </Content>
                    <SendMessage room={room} socket={ws} />
                </>
                :
                <Content>
                    Chat with your friends
                </Content>
            }

        </Container>
    )
}

function SendMessage({ room, socket }) {
    const { user } = useContext(AuthContext)
    const [inputMessage, setInputMessage] = useState("")
    const sendMessage = (e) => {
        e.preventDefault()
        if (inputMessage) {
            socket.send(JSON.stringify({
                action: "message",
                message: inputMessage,
                user: user.user_id,
                roomId: room?.roomId
            }))
            setInputMessage("");
        }
    }
    const onEmojiClick = (event, emojiObject) => {
        setInputMessage(prevInput => prevInput + emojiObject.emoji);
    };
    const emojiPicker = (
        <Tooltip>
            <Picker onEmojiClick={onEmojiClick}/>
        </Tooltip>
        
    )
    return (
        <Footer>
            <form onSubmit={sendMessage}>
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Enter your message" />
                <Whisper  placement="topEnd" controlId="control-id-click" trigger="click" speaker={emojiPicker}>
                    <Button>
                        <img className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" />
                    </Button>
                </Whisper>
                <IconButton icon={<SendIcon />} type="submit" circle />
            </form>
        </Footer>
    )
}