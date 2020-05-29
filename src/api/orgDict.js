import request from '@/utils/request'

export function fetchDivisionTree() {
  return request({
    url: 'http://localhost:18908/dict/division/list',
    method: 'get',
    params: {}
  })
}

export function fetchOrgList(data) {
  return request({
    url: 'http://localhost:18908/dict/org/list',
    method: 'get',
    params: data
  })
}
