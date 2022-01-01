import { createStore } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default createStore({
  state: {
    status: null
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },

    auth_success(state, token, user) {
      state.status = 'success'
      state.token = token
      state.user = user
    },

    auth_error(state) {
      state.status = 'error'
    },

    logout(state) {
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        console.log('user/dispatch-login: ', qs.stringify(user))
        setTimeout(() => { console.log("pause...!"); }, 3000);
        axios({ url: 'http://localhost:5000/api/login', data: qs.stringify(user), method: 'POST' })
          .then(resp => {
            console.log('response/login: ', resp)
            const token = resp.data.token
            const user = resp.data.user_name
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', token, user)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    login_old({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        console.log('user/dispatch-login: ', qs.stringify(user))
        setTimeout(() => { console.log("pause...!"); }, 3000);
        axios({ url: 'http://localhost:5031/users/login', data: qs.stringify(user), method: 'POST' })
          .then(resp => {
            console.log('response/login: ', resp)
            const token = resp.data.token
            const user = resp.data.user
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', token, user)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
  },
  modules: {
  }
})
