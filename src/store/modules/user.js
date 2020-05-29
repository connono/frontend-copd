import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, getAuth, setAuth, removeAuth, getOrgCode, setOrgCode, removeOrgCode } from '@/utils/auth'
import { resetRouter } from '@/router'
import { JsonToformData } from '@/utils/formData'

const state = {
  token: getToken(),
  auth: getAuth(),
  orgCode: getOrgCode()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_AUTH: (state, auth) => {
    state.auth = auth
  },
  SET_ORGCODE: (state, orgCode) => {
    state.orgCode = orgCode
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const jsonData = {
      userName: userInfo.userName.trim(),
      password: userInfo.password
    }

    return new Promise((resolve, reject) => {
      login(JsonToformData(jsonData)).then(response => {
        const { data } = response
        // console.log(data);
        commit('SET_TOKEN', data.userID)
        setToken(data.userID)
        commit('SET_AUTH', data.auth)
        setAuth(data.auth)
        commit('SET_ORGCODE', data.orgCode)
        setOrgCode(data.orgCode)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  /* getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },*/

  // user logout
  logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
    // logout(state.token).then(() => {
    commit('SET_TOKEN', '')
    removeToken()
    removeAuth()
    removeOrgCode()
    resetRouter()
    //    resolve()
    //  }).catch(error => {
    //    reject(error)
    //  })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

