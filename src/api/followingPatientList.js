import request from '@/utils/request'

export function getFollowingPatientList(data) {
  return request({
    url: 'http://localhost:18908/manage/followup/page/this',
    method: 'get',
    params: data
  })
}

export function getFollowingPatientCount(data) {
  return request({
    url: 'http://localhost:18908/manage/followup/count/this',
    method: 'get',
    params: data
  })
}

export function getFollowingPatientListReferral(data) {
  return request({
    url: 'http://localhost:18908/manage/followup/page/referral',
    method: 'get',
    params: data
  })
}

export function getFollowingPatientCountReferral(data) {
  return request({
    url: 'http://localhost:18908/manage/followup/count/referral',
    method: 'get',
    params: data
  })
}

export function ignoreFollowingPatient(data) {
  return request({
    url: 'http://localhost:18908/manage/followup/ignore',
    method: 'put',
    params: data
  })
}

export function createFollowRecord(data) {
  return request({
    url: 'http://localhost:18908/manage/followup/record',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

export function createFollowPlan(data) {
  return request({
    url: 'http://localhost:18908/manage/followup/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
