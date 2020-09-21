import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "./credentials"

const apiUrl = 'https://api.gitter.im/v1'

export const gitterLoginUrl = () => {
    const responseType = 'code'

    return `https://gitter.im/login/oauth/authorize?client_id=${CLIENT_ID}&response_type=${responseType}&redirect_uri=${REDIRECT_URI}`
}

export function getToken(code) {
    const params = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
    }

    const body = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

    return fetch(`https://gitter.im/login/oauth/token`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    }).then(res => {
        console.log(res)
        return res.text()
    }).then(text => {
        if (text === 'OK') {
            return []
        }
        if (text.length === 0) {
            return []
        }
        return JSON.parse(text)
    })
}

/**
 * Authed user staff
 */

export function me(token) {
    return callApi('user/me', token)
}

export function currentUser(token) {
    return callApi('user', token)
}

export function currentUserRooms(token) {
    return callApi('rooms', token) // https://api.gitter.im/v1/rooms
}

export function hideRoom(token, roomId, userId) {
    return callApi(`user/${userId}/rooms/${roomId}`, token, {
        method: 'DELETE'
    })
}

// { get the lists of rooms the user is part of}

/**
 * 
 * @param {*} userId 
 * @param {*} token 
 */

export function listRoom(userId, token) {
    return callApi(`user/${userId}/rooms`, token)
}

// { mark unread chat messages as read}

/**
 * 
 * @param {*} userId 
 * @param {*} roomId 
 * @param {*} token 
 * @param {*} chat 
 */

export function readMessage(userId, roomId, token, chat) {
    return callApi(`user/${userId}/rooms/${roomId}/unreadItems`, token, {
        method: 'POST',
        body: JSON.stringify({
             chat
        })
    })
}

// { get list of user's Github organization}

/**
 * 
 * @param {*} userId 
 * @param {*} token 
 */

export function githubOrgs(userId, token) {
    return callApi(`user/${userId}/orgs`, token)
}

// { get the list of Github repositories nested under the current user }

/**
 * 
 * @param {*} userId 
 * @param {*} token 
 */

export function githubRepos(userId, token) {
    return callApi(`user/${userId}/repos`, token)
}

// { List of Gitter channels nested under the current user}

/**
 * 
 * @param {*} userId 
 * @param {*} token 
 */

export function gitterChannels(userId, token) {
    return callApi(`user/${userId}/channels`, token)
}

// { get all unread messages}

/**
 * 
 * @param {*} userId 
 * @param {*} roomId 
 * @param {*} token 
 */

export function unreadItems(userId, roomId, token) {
    return callApi(`user/${userId}/rooms/${roomId}/unreadItems`, token)
}

// export function readMessage(token, userId, roomId) {
//     return callApi(`user/${userId}/rooms/${roomId}/unreadItems`, token, {
//         method: 'get'
//     })
// }

// {
//     Rooms resoruces
// }

/**
 * 
 * @param {*} token 
 * @param {*} id 
 */

// { List of rooms that current users are logged in }
export function room(token, id) {
    return callApi('rooms/' + id, token)
}

// { Remove user from room, also leave a room }

/**
 * 
 * @param {*} roomId 
 * @param {*} userId 
 * @param {*} token 
 */

export function leaveRoom(roomId, userId, token) {
    return callApi(`rooms/${roomId}/users/${userId}`, token, {
        method: 'DELETE'
    })
}

// { join room via the room id = roomId }

/**
 * 
 * @param {*} userId 
 * @param {*} token 
 * @param {*} roomId 
 */

export function joinRoom(userId, token, roomId) {
    return callApi(`user/${userId}/rooms`, token, {
        method: 'POST',
        body: JSON.stringify({
            id: roomId
        })
    })
}

// { join room via the uri of the room}

/**
 * 
 * @param {*} token 
 * @param {*} username 
 */

export function joinRoomByUserName(token, username) {
    return callApi('rooms', token, {
        method: 'POST',
        body: JSON.stringify({
            uri: username
        })
    })
}

// { Delete the via room id}

/**
 * 
 * @param {*} token 
 * @param {*} roomId 
 */

export function deleteRoom(token, roomId) {
    return callApi(`rooms/${roomId}`, token, {
        method: 'DELETE'
    })
}

// { Update the room i.e, topic of the room }

/**
 * 
 * @param {*} roomId 
 * @param {*} token 
 * @param {*} topic 
 */

export function updateRoom(roomId, token, topic) {
    return callApi(`rooms/${roomId}`, token, {
        method: 'PUT',
        body: JSON.stringify({
            topic: topic
        })
    })
}

// { Banned the use from the room}

/**
 * 
 * @param {*} username 
 * @param {*} token 
 * @param {*} roomId 
 */

export function banUser(username, token, roomId) {
    return callApi(`rooms/${roomId}/bans`, token, {
        method: 'POST',
        body: JSON.stringify({
            username: username
        })
    })
}

// { get Users of the specified room }

/**
 * 
 * @param {*} token 
 * @param {*} roomId 
 */

export function getRoomUsers(token, roomId) {
    return callApi(`rooms/${roomId}/users`, token)
}

/**
 * 
 * @param {*} token 
 * @param {*} roomId 
 * @param {*} skip 
 */

export function getRoomUsersWithSkip(token, roomId, skip) {
    return callApi(`rooms/${roomId}/users?skip=${skip}`, token)
}

/**
 * 
 * @param {*} id 
 * @param {*} limit 
 * @param {*} token 
 */

export function roomMessages(id, limit, token) {
    return callApi(`rooms/${id}/chatMessages?limit=${limit}`, token)
}

/**
 * 
 * @param {*} query 
 * @param {*} token 
 */

export function searchRooms(query, token) {
    return callApi(`rooms?q=${query}&limit=10`, token)
}

/**
 * 
 * @param {*} limit 
 * @param {*} id 
 * @param {*} beforeId 
 * @param {*} token 
 */

export function roomMessagesBefore(limit, id, beforeId, token) {
    return callApi(`rooms/${id}/chatMessages?limit=${limit}&beforeId=${beforeId}`, token)
}

/**
 * 
 * @param {*} token 
 * @param {*} roomId 
 * @param {*} messageId 
 */

export function getMessage(token, roomId, messageId) {
    return callApi(`rooms/${roomId}/chatMessages/${messageId}`, token)
}

/**
 * 
 * @param {*} roomId 
 * @param {*} token 
 * @param {*} text 
 */

export function sendMessage(roomId, token, text) {
    return callApi(`rooms/${roomId}/chatMessages`, token, {
        method: 'POST',
        body: JSON.stringify({
            text,
            status: true
        })
    })
}

// { updating messages}

/**
 * 
 * @param {*} roomId 
 * @param {*} token 
 * @param {*} chatMessageId 
 * @param {*} text 
 */

export function updateMessage(roomId, token, chatMessageId, text) {
    return callApi(`rooms/${roomId}/chatMessages/${chatMessageId}`, token, {
        method: 'PUT',
        body: JSON.stringify({
            text
        })
    })
}

/**
 * 
 * @param {*} endpoint 
 * @param {*} token 
 * @param {*} options 
 */

function callApi(endpoint, token, options = {method: 'get'}) {
    const url = `${apiUrl}/${endpoint}`

    return fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log(res)
        return res.text()
    }).then(text => {
        if (text === 'OK') {
            return []
        }
        if (text.length === 0) {
            return []
        }
        return JSON.parse(text)
    })
}

export function getUser(token, username) {

}