import { request } from '../request'

export function addUsers(info) {
    return request({
        url: '/users',
        data: info,
        method: 'post'
    })
}