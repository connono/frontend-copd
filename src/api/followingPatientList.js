import request from '@/utils/request'

export function getFollowingPatientList() {
  return request({
    url: '/followingPatientList',
    method: 'get',
  })
}

export function ignoreFollowingPatient(data){
  return request({
	url: '/followingPatientList/ignore',
	method: 'post',
	data
  })
}