import axios from 'axios'
const camelcaseKeys = require('camelcase-keys')

const state = {
  users: []
}

const getters = {
  getUserByUsername(state) {
    return username => state.users.find(user => user.user.username == username)
  }
}

const mutations = {
  setUsers(state, users) {
    state.users = users
  }
}

const actions = {
  fetchUsers({ commit }) {
    axios
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
