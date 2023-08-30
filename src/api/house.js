import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/lease/house/list',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return request({
    url: '/lv/lease/house/add',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/lv/lease/house/edit',
    method: 'post',
    data: params
  })
}

export function submitReview(params) {
  return request({
    url: '/lv/lease/house/submitReview',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/lv/lease/house/del',
    method: 'post',
    data: params
  })
}
