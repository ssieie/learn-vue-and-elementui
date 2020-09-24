import { request } from './request'

export function getUsers(info) {
    return request({
        url: '/users',
        params: info,
        method: 'get' //请求方式
    })
}