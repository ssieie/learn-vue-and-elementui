import { request } from '../request'

export function setUsers(info) {
    return request({
        url: `users/${info.id}/state/${info.mg_state}`,
        method:'put'
    })
}