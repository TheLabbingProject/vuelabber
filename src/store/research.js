import session from '@/api/session'
import { GROUPS, STUDIES, SUBJECTS } from '@/api/research/endpoints'
import { getSubjectQueryString } from '@/api/research/query'
import { camelToSnakeCase } from '@/utils'

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
  addSubject(state, subject) {
    state.subjects.push(subject)
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
  updateStudyState(state, updatedStudy) {
    let index = state.studies.indexOf(
      state.studies.find(study => study.id === updatedStudy.id)
    )
    // Mutating an array directly causes reactivity problems
    let newStudies = state.studies.slice()
    newStudies[index] = updatedStudy
    state.studies = newStudies
  },
  addGroup(state, group) {
    state.groups.push(group)
  },
  updateSubjectState(state, updatedSubject) {
    // Remove the old version
    let subjects = state.subjects.filter(
      subject => subject.id != updatedSubject.id
    )
    // Add the updated version
    subjects.push(updatedSubject)
    state.subjects = subjects
  },
  removeSubjectFromState(state, subject) {
    state.subjects = state.subjects.filter(
      existingSubject => existingSubject.id != subject.id
    )
  },
  removeStudyFromState(state, study) {
    state.studies = state.studies.filter(
      existingStudy => existingStudy.id != study.id
    )
  }
}

const actions = {
  fetchStudies({ commit }) {
    return session
      .get(STUDIES)
      .then(({ data }) => commit('setStudies', data.results))
      .catch(console.error)
  },
  fetchSubjects({ commit }, { filters, pagination }) {
    let queryString = getSubjectQueryString({ filters, pagination })
    return session
      .get(`${SUBJECTS}/${queryString}`)
      .then(({ data }) => data.results.map(item => camelcaseKeys(item)))
      .then(data => {
        commit('setSubjects', data)
        return data
      })
      .catch(console.error)
  },
  fetchGroups({ commit }) {
    return session
      .get(GROUPS)
      .then(({ data }) => commit('setGroups', camelcaseKeys(data.results)))
      .catch(console.error)
  },
  createStudy({ commit }, study) {
    return session
      .post(STUDIES, study)
      .then(({ data }) => camelcaseKeys(data))
      .then(data => commit('addStudy', data))
      .catch(console.error)
  },
  updateStudy({ commit }, study) {
    return session
      .patch(`${STUDIES}/${study.id}/`, camelToSnakeCase(study))
      .then(({ data }) => camelcaseKeys(data))
      .then(data => {
        commit('updateStudyState', data)
        return data
      })
      .catch(console.error)
  },
  deleteStudy({ commit }, study) {
    return session
      .delete(`${STUDIES}/${study.id}/`)
      .then(() => commit('removeStudyFromState', study))
      .catch(console.error)
  },
  createGroup({ commit }, group) {
    return session
      .post(GROUPS, group)
      .then(({ data }) => camelcaseKeys(data))
      .then(data => commit('addGroup', data))
      .catch(console.error)
  },
  createSubject({ commit }, subject) {
    return session
      .post(SUBJECTS, camelToSnakeCase(subject))
      .then(({ data }) => camelcaseKeys(data))
      .then(data => {
        commit('addSubject', data)
        return data
      })
      .catch(console.error)
  },
  updateSubject({ commit }, subject) {
    return session
      .patch(`${SUBJECTS}/${subject.id}/`, camelToSnakeCase(subject))
      .then(({ data }) => camelcaseKeys(data))
      .then(data => {
        commit('updateSubjectState', data)
        return data
      })
      .catch(console.error)
  },
  deleteSubject({ commit }, subject) {
    return session
      .delete(`${SUBJECTS}/${subject.id}/`)
      .then(() => commit('removeSubjectFromState', subject))
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
