import request from '@/utils/request'

export function getCorrectPatientList(data) {
  return request({
    url: 'http://localhost:18908/manage/referral/page',
    method: 'get',
    params: data
  })
}

export function approve(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'http://localhost:18908/manage/referral/approve',
    method: 'post',
    params: data
  })
}

export function refuse(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'http://localhost:18908/manage/referral/refuse',
    method: 'put',
    params: data
  })
}
