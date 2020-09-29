import { request } from '../request'

export function giveRight(roleId, keys) {
    return request({
        url: `roles/${roleId}/rights`,
        method: 'post',
        data: {
            rids: keys
        }
    })
}