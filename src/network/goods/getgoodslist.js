import { request } from '../request'

export function getGoodsList (info) {
  return request({
    url: 'goods',
    method: 'get',
    params: {
      query: info.query,
      pagenum: info.pagenum,
      pagesize: info.pagesize
    }
  })
}

export function getGoodsListAdd () {
  return request({
    url: 'categories',
    method: 'get',
  })
}

export function removeById (id) {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  })
}

export function getGoodsParams (id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel
    }
  })
}

export function addGoods (info) {
  return request({
    url: 'goods',
    method: 'post',
    data: {
      info
    }
  })
}
