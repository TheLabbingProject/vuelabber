import session from '@/api/session'
import { GROUPS, STUDIES, SUBJECTS } from '@/api/research/endpoints'
import { getSubjectQueryString } from '@/api/research/query'
import { camelToSnakeCase } from '@/utils'

const state = {
  studies: [],
  groups: [],
  selectedStudy: null,
  selectedStudyGroups: [],
  subjects: [],
  selectedSubjectId: null
}

const getters = {
  getStudyByTitle(state) {
    return studyTitle => state.studies.find(study => study.title === studyTitle)
  },
  getSelectedStudyGroupByTitle(state) {
    return title =>
      state.selectedStudyGroups.find(group => group.title === title)
  },
  getGroupByUrl(state) {
    return url => state.groups.find(group => group.url === url)
  },
  getStudyGroups(state) {
    return study =>
      study ? state.groups.filter(group => group.study.id === study.id) : []
  },
  getSubjectById(state) {
    return id => state.subjects.find(subject => subject.id === id)
  },
  getSelectedSubject(state, getters) {
    return getters['getSubjectById'](state.selectedSubjectId)
  },
  getSubjectByUrl(state) {
    return url => state.subjects.find(subject => subject.url === url)
  },
  getSelectedStudyTitle(state) {
    return state.selectedStudy ? state.selectedStudy.title : null
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
  setGroups(state, groups) {
    state.groups = groups
  },
  setSelectedStudyGroups(state, selectedStudyGroups) {
    state.selectedStudyGroups = selectedStudyGroups
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
  },
  setSelectedStudyByTitle(state, title) {
    state.selectedStudy = state.studies.find(study => study.title === title)
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
      .then(({ data }) => {
        commit('setSubjects', data.results)
        return data.results
      })
      .catch(console.error)
  },
  fetchGroups({ commit }) {
    return session
      .get(GROUPS)
      .then(({ data }) => commit('setGroups', data.results))
      .catch(console.error)
  },
  fetchSelectedStudyGroups({ commit, state }) {
    return session
      .get(`${GROUPS}/?study__id=${state.selectedStudy.id}`)
      .then(({ data }) => {
        commit('setSelectedStudyGroups', data.results)
      })
      .catch(console.error)
  },
  createStudy({ commit }, study) {
    return session
      .post(STUDIES, study)
      .then(({ data }) => commit('addStudy', data))
      .catch(console.error)
  },
  updateStudy({ commit }, study) {
    return session
      .patch(`${STUDIES}/${study.id}/`, camelToSnakeCase(study))
      .then(({ data }) => {
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
  createGroup({ dispatch }, group) {
    return (
      session
        .post(GROUPS, group)
        // Can't just add the returned value because GET
        // and POST return different JSONs (the POST result)
        // doesn't contain Study as an object but as a url
        // TODO: Make more efficient by getting just the
        // new created Group instance (by ID) and committing it.
        .then(() => dispatch('fetchGroups'))
        .catch(console.error)
    )
  },
  createSubject({ commit }, subject) {
    return session
      .post(SUBJECTS, subject)
      .then(({ data }) => {
        commit('addSubject', data)
        return data
      })
      .catch(console.error)
  },
  updateSubject({ commit }, subject) {
    return session
      .patch(`${SUBJECTS}/${subject.id}/`, camelToSnakeCase(subject))
      .then(({ data }) => {
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
