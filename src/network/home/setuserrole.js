import { request } from '../request'

export function setUserRole (id, rid) {
  console.log(rid)
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid: rid
    }
  })
}
