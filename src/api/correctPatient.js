import request from '@/utils/request'

export function getCorrectPatientList(data) {
  return request({
    url: 'http://localhost:18908/manage/referral/page',
    method: 'get',
	params: data
  })
}