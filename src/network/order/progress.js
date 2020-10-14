import {request} from '../request'

export function getProgress () {
  return request({
    url: `/kuaidi/1106975712662`,
    method: 'get'
  })
}
