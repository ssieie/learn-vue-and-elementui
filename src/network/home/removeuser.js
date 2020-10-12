import { request } from '../request'

export function removeUserInfo (id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}
