import axios from 'axios'
const camelcaseKeys = require('camelcase-keys')

const state = {
  profiles: []
}

const getters = {
  getUserByUsername(state) {
    return username =>
      state.profiles.find(profile => profile.user.username == username)
  },
  getProfileByUserUrl(state) {
    return url => state.profiles.find(profile => profile.user.url == url)
  },
  getUserInitialsFromProfileUrl(state, getters) {
    return url => {
      let user = getters.getProfileByUserUrl(url).user
      return `${user.first_name[0]}${user.last_name[0]}`
    }
  },
  currentUser(state, getters, rootState) {
    return state.profiles.find(
      user => user.user.username === rootState.auth.user.username
    )
  }
}

const mutations = {
  setProfiles(state, profiles) {
    state.profiles = profiles
  }
}

const actions = {
  fetchProfiles({ commit }) {
    return axios
      .get('/api/accounts/profiles/')
      .then(({ data }) =>
        commit('setProfiles', data.results.map(item => camelcaseKeys(item)))
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
