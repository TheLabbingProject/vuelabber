import session from '@/api/session'
import { USERS, LABS } from '@/api/accounts/endpoints'
import { getUserQueryString } from '@/api/accounts/query'

const state = {
  users: [],
  labs: []
}

const getters = {
  getUserByUsername(state) {
    return username => state.users.find(user => user.username === username)
  },
  getUserByUrl(state) {
    return url => state.users.find(user => user.url === url)
  },
  getUserInitialsFromUrl(state, getters) {
    return url => {
      let user = getters.getUserByUrl(url)
      return `${user.firstName[0]}${user.lastName[0]}`
    }
  }
}

const mutations = {
  setUsers(state, users) {
    state.users = users
  },
  updateUserState(state, updatedUser) {
    // Remove the old version
    let users = state.users.filter(user => user.id != updatedUser.id)
    // Add the updated version
    users.push(updatedUser)
    state.users = users
  },
  setLabs(state, labs) {
    state.labs = labs
  }
}

const actions = {
  fetchUsers({ commit }, { filters, pagination }) {
    let queryString = getUserQueryString({ filters, pagination })
    return session
      .get(`${USERS}/${queryString}`)
      .then(({ data }) => commit('setUsers', data.results))
      .catch(console.error)
  },
  updateUser({ commit }, user) {
    return session
      .patch(`${USERS}/${user.id}/`, user)
      .then(({ data }) => {
        commit('updateUserState', data)
        return data
      })
      .catch(console.error)
  },
  fetchLabs({ commit }) {
    return session
      .get(LABS)
      .then(({ data }) => commit('setLabs', data.results))
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
