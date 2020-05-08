import request from '@/utils/request'

export function getCreatePatient(data) {
  return request({
    url: 'http://localhost:18908/manage/register/page',
    method: 'get',
	params: data
  })
}

export function createPatient(data) {
  return request({
	headers: {
      'Content-Type': 'application/json'
    },
    url: 'http://localhost:18908/user/patient/create',
    method: 'post',
	data
  })
}