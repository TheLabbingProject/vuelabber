import session from '@/api/session'
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
  currentUserProfile(state, getters, rootState) {
    return state.profiles.find(
      profile => profile.user.username === rootState.auth.user.username
    )
  },
  currentUserIsStaff(state, getters) {
    let profile = getters.currentUserProfile
    if (profile) return profile.user.is_staff
    return false
  }
}

const mutations = {
  setProfiles(state, profiles) {
    state.profiles = profiles
  }
}

const actions = {
  fetchProfiles({ commit }) {
    return session
      .get('/api/accounts/profile/')
      .then(({ data }) => data.results.map(item => camelcaseKeys(item)))
      .then(data => commit('setProfiles', data))
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
