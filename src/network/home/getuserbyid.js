import { request } from '../request'

export function getUserInfoById(info) {
    return request({
        url: `users/${info}`,
        method: 'get'
    })
}