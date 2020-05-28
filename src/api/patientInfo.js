import request from '@/utils/request'

export function getPatientBaseInfo(data){
	return request({
		url: 'http://localhost:18908/user/patient/detail/baseinfo',
		method: 'get',
		params: data
	})
	
}

export function getPatientManageInfo(data){
	return request({
		url: 'http://localhost:18908/user/patient/detail/manage',
		method: 'get',
		params: data
	})
	
}

export function getPatientReferralInfo(data){
	return request({
		url: 'http://localhost:18908/user/patient/detail/referral',
		method: 'get',
		params: data
	})
	
}

export function getPatientWarningInfo(data){
	return request({
		url: 'http://localhost:18908/user/patient/history/alert/page',
		method: 'get',
		params: data
	})
	
}

export function getPatientFollowingInfo(data){
	return request({
		url: 'http://localhost:18908/user/patient/history/followup/page',
		method: 'get',
		params: data
	})
	
}

export function getPatientData(data){
	return request({
		url: 'http://localhost:18908/data/fetch/list',
		method: 'get',
		params: data
	})
	
}

export function createReferralApply(data){
	return request({
		url: 'http://localhost:18908/manage/referral/apply',
		method: 'post',
		headers: {
		  'Content-Type': 'application/json'
		},
		data
	})
}

export function createReferralBack(data){
	return request({
		url: 'http://localhost:18908/manage/referral/back',
		method: 'put',
		params: data
	})
	
}