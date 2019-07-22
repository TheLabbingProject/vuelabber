import axios from 'axios'
const camelcaseKeys = require('camelcase-keys')

const state = {
  users: []
}

const getters = {
  getUserByUsername(state) {
    return username => state.users.find(user => user.user.username == username)
  },
  getUserByUrl(state) {
    return url => state.users.find(user => user.user.url == url)
  },
  getUserInitialsFromUrl(state, getters) {
    return url => {
      let user = getters.getUserByUrl(url)
      return `${user.user.first_name[0]}${user.user.last_name[0]}`
    }
  }
}

const mutations = {
  setUsers(state, users) {
    state.users = users
  }
}

const actions = {
  fetchUsers({ commit }) {
    return axios
      .get('/api/accounts/profiles/')
      .then(({ data }) =>
        commit('setUsers', data.results.map(item => camelcaseKeys(item)))
      )
      .catch(console.error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
