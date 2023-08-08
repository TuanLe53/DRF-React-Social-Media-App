import { useContext, useEffect, useState } from "react"
import { Button } from "rsuite"
import AuthContext from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import ServerUrl from "../../api/ServerUrl"

export default function InboxBtn({profile}){
    const { user } = useContext(AuthContext)
    const [room, setRoom] = useState([])
    const navigate = useNavigate()
    
    const createInbox = async () => {
        fetch(ServerUrl.API_URL + `create-chat/${user.username}/${profile.id}/`, {
            method: "POST"
        }).then(res => res.json())
            .then(res => {
                setRoom([...room, res])
            })
    }

    useEffect(() => {
        if (room.length !== 0) {
            navigate(`/chat/${room[0]?.roomId}`, {state:{room:room}})
        }
    }, [room])

    return (
        <>
            <Button appearance="primary" size="lg" onClick={createInbox}>Inbox</Button>
        </>
    )
}
