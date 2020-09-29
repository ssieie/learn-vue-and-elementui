import { request } from '../request'

export function getRolesId(id) {
    return request({
        url: `/roles/${id}`,
        method: 'get'
    })
}