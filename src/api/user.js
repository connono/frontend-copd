import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:18908/auth/login',
    method: 'post',
	headers: {
	  'Content-Type': "application/x-www-form-urlencoded;charset=utf-8"
    },
    data,
  })
}

/*export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}*/

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
