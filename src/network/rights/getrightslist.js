import { request } from '../request'

export function getRightsList() {
    return request({
        url: '/rights/tree',
        method: 'get'
    })
}