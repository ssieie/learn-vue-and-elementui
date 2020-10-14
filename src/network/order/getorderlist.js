import { request } from '../request'

export function getOrderList (info) {
  return request({
    url: 'orders',
    method: 'get',
    params: {
      pagenum: info.pagenum,
      pagesize: info.pagesize
    }
  })
}
