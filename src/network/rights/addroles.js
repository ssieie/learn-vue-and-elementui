import { request } from '../request'

export function addRoles(info) {
    return request({
        url: 'roles',
        data: info,
        method: 'post'
    })
}