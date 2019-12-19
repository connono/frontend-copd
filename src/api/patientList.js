import request from '@/utils/request'

export function getPatientList() {
  return request({
    url: '/patientList',
    method: 'get'
  })
}