import { request } from '../request'

export function getRolesList() {
    return request({
        url: 'roles',
        method: 'get'
    })
}