import request from '@/utils/request'

export function getCreatePatient() {
  return request({
    url: '/createPatient',
    method: 'get'
  })
}