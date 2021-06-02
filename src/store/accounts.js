import session from '@/api/session'
import { ACCOUNTS_BASE, LABS, USERS } from '@/api/accounts/endpoints'
import { getUserQueryString } from '@/api/accounts/query'

const state = {
  users: [],
  labs: [],
  institutionNames: [],
  potentialCollaborators: []
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
  setPotentialCollaborators(state, potentialCollaborators) {
    state.potentialCollaborators = potentialCollaborators
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
  },
  setInstitutionNames(state, institutionNames) {
    state.institutionNames = institutionNames.map(name =>
      name == undefined ? '' : name
    )
  }
}

const actions = {
  fetchUsers({ commit }, query) {
    let queryString = getUserQueryString(query)
    let URL = `${USERS}/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => commit('setUsers', data.results))
      .catch(console.error)
  },
  fetchPotentialCollaborators({ commit }, studyId) {
    let query = { filters: { studyNotEqual: studyId }, options: {} }
    let queryString = getUserQueryString(query)
    let URL = `${USERS}/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => commit('setPotentialCollaborators', data.results))
      .catch(console.error)
  },
  patchUser({ commit }, data) {
    let { userId, ...dataWithoutId } = data
    return session
      .patch(`${USERS}/${userId}/`, dataWithoutId)
      .then(({ data }) => {
        commit('updateUserState', data)
        return true
      })
      .catch(console.error)
  },
  fetchInstitutionNames({ commit }) {
    return session
      .get(`${ACCOUNTS_BASE}/institutionList`)
      .then(({ data }) => {
        commit('setInstitutionNames', data.results)
      })
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
