import ServerUrl from "../api/ServerUrl"

let get_user_profile = async (username, authTokens) => {
    let response = await fetch(ServerUrl.API_URL + `profile/${username}/`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
    })
    let data = await response.json()
    return data
}
export default get_user_profile