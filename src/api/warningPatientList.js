import request from '@/utils/request'
import { JsonToformData } from '@/utils/formData'

export function getWarningPatientCount(data){
	return request({
		url: 'http://localhost:18908/manage/alert/count/this',
		method: 'get',
		params: data
	})
	
}

export function getWarningPatientList(data) {
  return request({
    url: 'http://localhost:18908/manage/alert/page/this',
    method: 'get',
	params: data
  })
}

export function getWarningPatientCountReferral(data){
	return request({
		url: 'http://localhost:18908/manage/alert/count/referral',
		method: 'get',
		params: data
	})
	
}

export function getWarningPatientListReferral(data) {
  return request({
    url: 'http://localhost:18908/manage/alert/page/referral',
    method: 'get',
	params: data
  })
}

export function deleteWarningPatient(data){
  //var data = JsonToformData(data)
  return request({
	url: 'http://localhost:18908/manage/alert/ignore',
	method: 'put',
	headers: {
      'Content-Type': 'application/json'
    },
	//headers: {
	//  'Content-Type': "application/x-www-form-urlencoded;charset=utf-8"
    //},
	params: data
  })
}

export function createFollowRecord(data){
  return request({
	url: 'http://localhost:18908/manage/followup/record',
	method: 'post',
	headers: {
      'Content-Type': 'application/json'
    },
	data
  })
}
