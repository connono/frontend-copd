import request from '@/utils/request'

export function getDoctorInfo(data) {
  return request({
    url: 'http://localhost:18908/user/doctor/list',
    method: 'get',
    params: data
  })
}

export function getDoctorName(data) {
  return request({
    url: 'http://localhost:18908/user/doctor/name',
    method: 'get',
    params: data
  })
}

export function getDoctorListOfAnyHos(data) {
  return request({
    url: 'http://localhost:18908/user/doctor/list/anyhos',
    method: 'get',
    params: data
  })
}
