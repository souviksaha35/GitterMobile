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

export function readMessage(token, userId, roomId) {
    return callApi(`user/${userId}/rooms/${roomId}/unreadItems`, token, {
        method: 'get'
    })
}

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

function callApi(endpoint, token, options) {
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