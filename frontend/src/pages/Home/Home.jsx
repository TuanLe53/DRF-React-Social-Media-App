import { Container, Content, Sidebar } from "rsuite"
import Posts from "../../components/post/Posts"
import { useContext, useEffect, useState } from "react"
import ProfileIcon from "../../components/ProfileIcon"
import AuthContext from "../../context/AuthContext"
import ServerUrl from "../../api/ServerUrl"

function Home() {
    
    return (
        <Container>
            <Container className="This-is-main">
                <Content>
                    <Posts />
                </Content>
            </Container>
            <Sidebar>
                <SuggestedUser />
            </Sidebar>
        </Container>
    )
}

export default Home

function SuggestedUser() {
    const [userList, setUserList] = useState([])
    const {user} = useContext(AuthContext)
    useEffect(() => {
        fetch(ServerUrl.API_URL + `suggested-user/${user.username}/`)
            .then(res => res.json())
            .then(res => {
                setUserList(res)
            })
    }, [])

    return (
        <>
            <h2>Suggested for you</h2>
            {userList.map((profile) => (
                <ProfileIcon profile={profile} />
            ))}
        </>
    )
}