import { request } from '../request'

export function submitEdit(info) {
    return request({
        url: `/roles/${info.roleId}`,
        data: {
            roleName: info.roleName,
            roleDesc: info.roleDesc
        },
        method: 'put'
    })
}