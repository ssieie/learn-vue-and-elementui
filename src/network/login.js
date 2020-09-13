import { request } from './request'

export function getLoginInfo(info) {
    return request({
        url: '/login',
        params: info
    })
}
