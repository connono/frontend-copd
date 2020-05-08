import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const AuthKey = 'auth'
const OrgCodeKey = 'orgCode'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAuth() {
  return Cookies.get(AuthKey)
}

export function setAuth(auth) {
  return Cookies.set(AuthKey, auth)
}

export function removeAuth() {
  return Cookies.remove(AuthKey)
}

export function getOrgCode() {
  return Cookies.get(OrgCodeKey)
}

export function setOrgCode(orgCode) {
  return Cookies.set(OrgCodeKey, orgCode)
}

export function removeOrgCode() {
  return Cookies.remove(OrgCodeKey)
}
