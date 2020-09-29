import { request } from '../request'

export function deleteRoles(id) {
    return request({
        url: `/roles/${id}`,
        method: 'delete'
    })
}