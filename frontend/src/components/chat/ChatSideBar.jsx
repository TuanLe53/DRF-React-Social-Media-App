import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext"
import { Container, Content, Header, Stack } from "rsuite"
import Avatar from "react-avatar";
import ServerUrl from "../../api/ServerUrl";

export default function ChatSideBar({onlineUser, setCurrentUser}) {
    const { user } = useContext(AuthContext)
    const [rooms, setRooms] = useState([])

    const fetchRoom = async () => {
        let res = await fetch(ServerUrl.API_URL + `chat/${user.username}/rooms/`)
        let data = await res.json()
        let formattedData = await formattedRoom(data, onlineUser, user)
        setRooms(formattedData)
    }

    useEffect(() => {
        fetchRoom()
    },[])

    return (
        <Container className="chat-side-bar">
            <Header>Users List</Header>
            <Content>
                {rooms.map((room) => (
                    <Link to={`/chat/${room.roomId}`} key={room.id} onClick={() => setCurrentUser(room)}>
                        <Stack>
                            <Avatar src={ServerUrl.BASE_URL + room.image} round={true} size="40"/>
                            <h3>{room.name}</h3>
                        </Stack>
                        {room.isOnline
                        ? 
                            <p>
                                Online
                            </p>
                        :
                            <p>
                                Offline
                            </p>
                        }
                    </Link>
                ))}
            </Content>
        </Container>
    )
}

export function formattedRoom(x, onlineUser, user) {
    const userId = user.user_id
    return x.reduce((acumulator, item) => {
        if (item.type === "DM" || item.type === "SELF") {
            let result = {}
            result["roomId"] = item.roomId;
            let member = null;
            for (let user of item.member) {
                if (user.id !== userId || item.type === "SELF") {
                    member = user;
                }
            }
            if (member) {
                result["name"] = member.user;
                result["image"] = member.avatar_img;
                result["id"] = member.id;

                const checkUser = obj => { 
                    console.log("2", obj.user)
                    console.log("1", member.id)
                    obj.user === member.id;
                }
                result["isOnline"] = onlineUser.some(checkUser);
            }
            acumulator.push(result)
            return acumulator
        }
        return acumulator
    }, []);
}
