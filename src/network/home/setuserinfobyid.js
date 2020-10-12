import { request } from '../request'

export function setUserInfoById (info) {
  return request({
    url: `/users/${info.id}`,
    method: 'put',
    data: {
      email: info.email,
      mobile: info.mobile
    }
  })
}
