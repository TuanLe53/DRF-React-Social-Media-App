import { useState, useEffect } from "react";
import Post from "./Post"
import ServerUrl from "../../api/ServerUrl";

function Posts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch(ServerUrl.API_URL + 'posts/')
            .then(res => res.json())
            .then(res => {
                setPosts(res)
            })
    }, [])

    return (
        <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    <Post post={post} />
                </li>
            ))}
        </ul>
    )
}

export default Posts