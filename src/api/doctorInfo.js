import request from '@/utils/request'

export function getDoctorInfo(data){
	return request({
		url: 'http://localhost:18908/user/doctor/list',
		method: 'get',
		params: data
	})
}