import request from '@/utils/request'

export function getPatientList(data) {
  return request({
    url: 'http://localhost:18908/manage/index/page/hospital',
    method: 'get',
    params: data
  })
}

export function getPatientCount(data) {
  return request({
    url: 'http://localhost:18908/manage/index/count/hospital',
    method: 'get',
    params: data
  })
}

export function getPatientListDoctor(data) {
  return request({
    url: 'http://localhost:18908/manage/index/page/doctor',
    method: 'get',
    params: data
  })
}

export function getPatientCountDoctor(data) {
  return request({
    url: 'http://localhost:18908/manage/index/count/doctor',
    method: 'get',
    params: data
  })
}

export function getSubhospital(data) {
  return request({
    url: 'http://localhost:18908/dict/org/subhospital',
    method: 'get',
    params: data
  })
}
