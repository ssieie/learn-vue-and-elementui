import { request } from '../request'

export function getCateList (info) {
  return request({
    url: 'categories',
    method: 'get',
    params: {
      info
    }
  })
}

export function addCate (info) {
  return request({
    url: 'categories',
    method: 'post',
    data: {
      cat_pid: info.cat_pid,
      cat_name: info.cat_name,
      cat_level: info.cat_level
    }
  })
}

export function editCate (id, catName) {
  return request({
    url: `categories/${id}`,
    method: 'put',
    data: {
      cat_name: catName
    }
  })
}

export function removeCate (id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}
