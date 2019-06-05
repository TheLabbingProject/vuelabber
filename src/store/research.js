import axios from 'axios'

const state = {
  studies: [],
  groups: []
}

const getters = {
  getStudyByTitle(state) {
    return studyTitle => state.studies.find(study => study.title === studyTitle)
  },
  getStudyGroupByTitle(state) {
    return ({ study, groupTitle }) =>
      state.groups.find(
        group => group.title === groupTitle && group.study.id === study.id
      )
  },
  getGroupByUrl(state) {
    return url => state.groups.find(group => group.url === url)
  },
  getStudyGroups(state) {
    return study => state.groups.filter(group => group.study.id === study.id)
  }
}

const mutations = {
  setStudies(state, studyList) {
    state.studies = studyList
  },
  setGroups(state, groupList) {
    state.groups = groupList
  },
  addStudy(state, study) {
    state.studies.push(study)
  }
}

const actions = {
  fetchStudies({ commit }) {
    axios
      .get('/api/research/studies/')
      .then(({ data }) => commit('setStudies', data.results))
      .catch(console.error)
  },
  fetchGroups({ commit }) {
    axios
      .get('/api/research/groups/')
      .then(({ data }) => commit('setGroups', data.results))
      .catch(console.error)
  },
  createStudy({ commit }, study) {
    axios
      .post('/api/research/studies/', study)
      .then(response => console.log(response))
      .catch(console.error)
    commit('addStudy', study)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
