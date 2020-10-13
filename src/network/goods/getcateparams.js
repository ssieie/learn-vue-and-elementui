import { request } from '../request'

export function getCateParams (id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel
    }
  })
}

export function addParams (id, name, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: {
      attr_name: name,
      attr_sel: sel
    }
  })
}

export function getParamsNameById (id, attrId, sel) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'get',
    params: {
      attr_sel: sel
    }
  })
}

export function editParams (id, attrID, name, sel, vals) {
  return request({
    url: `categories/${id}/attributes/${attrID}`,
    method: 'put',
    data: {
      attr_name: name,
      attr_sel: sel,
      attr_vals: vals
    }
  })
}

export function removeParams (id, attrId) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'delete'
  })
}
