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

export function ignoreFollowingPatient(data) {
  return request({
    url: 'http://localhost:18908/manage/followup/ignore',
    method: 'put',
	params: data
  })
}