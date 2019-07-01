import axios from 'axios'
const camelcaseKeys = require('camelcase-keys')

const state = {
  studies: [],
  groups: [],
  subjects: [],
  selectedSubjectId: null
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
  },
  getSubjectById(state) {
    return id => state.subjects.find(subject => subject.id === id)
  },
  getSelectedSubject(state, getters) {
    return getters['getSubjectById'](state.selectedSubjectId)
  },
  getSubjectByUrl(state) {
    return url => state.subjects.find(subject => subject.url === url)
  }
}

const mutations = {
  setStudies(state, studies) {
    state.studies = studies
  },
  setSubjects(state, subjects) {
    state.subjects = subjects
  },
  setSelectedSubjectId(state, selectedSubjectId) {
    state.selectedSubjectId = selectedSubjectId
  },
  setGroups(state, groupList) {
    state.groups = groupList
  },
  addStudy(state, study) {
    state.studies.push(study)
  },
  addGroup(state, group) {
    state.groups.push(group)
  },
  updateSubjectState(state, subject) {
    state.subjects = state.subjects.filter(
      existingSubject => existingSubject.id != subject.id
    )
    state.subjects.push(subject)
  },
  removeSubjectFromState(state, subject) {
    state.subjects = state.subjects.filter(
      existingSubject => existingSubject.id != subject.id
    )
  }
}

const actions = {
  fetchStudies({ commit }) {
    return axios
      .get('/api/research/studies/')
      .then(({ data }) => commit('setStudies', data.results))
      .catch(console.error)
  },
  fetchSubjects({ commit }) {
    return axios
      .get('/api/research/subjects/')
      .then(({ data }) =>
        commit('setSubjects', data.results.map(item => camelcaseKeys(item)))
      )
      .catch(console.error)
  },
  fetchGroups({ commit }) {
    return axios
      .get('/api/research/groups/')
      .then(({ data }) => commit('setGroups', camelcaseKeys(data.results)))
      .catch(console.error)
  },
  createStudy({ commit }, study) {
    return axios
      .post('/api/research/studies/', study)
      .then(({ data }) =>
        axios
          .get('/api/research/studies/' + data.id)
          .then(({ data }) => commit('addStudy', data))
      )
      .catch(console.error)
  },
  createGroup({ commit }, group) {
    return axios
      .post('/api/research/groups/', group)
      .then(({ data }) =>
        axios
          .get('/api/research/groups/' + data.id)
          .then(({ data }) => commit('addGroup', data))
      )
      .catch(console.error)
  },
  createSubject({ commit }, subject) {
    return axios
      .post('/api/research/subjects/', camelToSnakeCase(subject))
      .then(({ data }) => camelcaseKeys(data))
      .then(data => {
        commit('updateSubjectState', data)
        return data
      })
      .catch(console.error)
  },
  updateSubject({ commit }, subject) {
    return axios
      .patch(`/api/research/subjects/${subject.id}/`, camelToSnakeCase(subject))
      .then(({ data }) => camelcaseKeys(data))
      .then(data => {
        commit('updateSubjectState', data)
        return data
      })
      .catch(console.error)
  },
  deleteSubject({ commit }, subject) {
    return axios
      .delete(`/api/research/subjects/${subject.id}/`)
      .then(() => commit('removeSubjectFromState', subject))
      .catch(console.error)
  },
  filterSubjects({ commit }, filterString) {
    return axios
      .get(`/api/research/subjects/?${filterString}`)
      .then(({ data }) =>
        commit('setSubjects', data.results.map(item => camelcaseKeys(item)))
      )
      .catch(console.error)
  }
}
const camelToSnakeCase = obj => {
  let result = {}
  Object.keys(obj).forEach(
    key =>
      (result[key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)] =
        obj[key])
  )
  return result
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
