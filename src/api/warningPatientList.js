import request from '@/utils/request'

export function getWarningPatientList() {
  return request({
    url: '/warningPatientList',
    method: 'get',
  })
}

export function deleteWarningPatient(data){
  return request({
	url: '/warningPatientList/delete',
	method: 'post',
	data
  })
}