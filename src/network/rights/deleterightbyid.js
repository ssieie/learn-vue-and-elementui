import { request } from '../request'

export function deleteRightById(roleId, rightId) {
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}