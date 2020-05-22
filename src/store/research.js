import session from '@/api/session'
import { GROUPS, STUDIES, SUBJECTS } from '@/api/research/endpoints'
import {
  getGroupQueryString,
  getSubjectQueryString
} from '@/api/research/query'
import { camelToSnakeCase } from '@/utils'

const state = {
  studies: [],
  groups: [],
  subjects: [],
  plots: { subject: {} }
}

const getters = {
  getGroupByUrl(state) {
    return url => state.groups.find(group => group.url === url)
  },
  getSubjectById(state) {
    return id => state.subjects.find(subject => subject.id === id)
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
  setGroups(state, groups) {
    state.groups = groups
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
  setSubjectDateOfBirthPlot(state, script) {
    var plots = Object.assign({}, state.plots)
    plots.subject.dateOfBirth = script
    state.plots = plots
  }
}

const actions = {
  fetchStudies({ commit }) {
    return session
      .get(STUDIES)
      .then(({ data }) => commit('setStudies', data.results))
      .catch(console.error)
  },
  fetchSubjects({ commit }, { filters, options }) {
    let queryString = getSubjectQueryString({ filters, options })
    return session
      .get(`${SUBJECTS}/${queryString}`)
      .then(({ data }) => {
        commit('setSubjects', data.results)
        return data.results
      })
      .catch(console.error)
  },
  fetchGroups({ commit }, { filters, options }) {
    let queryString = getGroupQueryString({ filters, options })
    return session
      .get(`${GROUPS}/${queryString}`)
      .then(({ data }) => commit('setGroups', data.results))
      .catch(console.error)
  },
  fetchGroupById({ commit }, groupId) {
    return session
      .get(`${GROUPS}/?id=${groupId}`)
      .then(({ data }) => data.results[0])
      .then(group => {
        commit('addGroup', group)
        return group
      })
      .catch(console.error)
  },
  createStudy({ commit }, study) {
    return session
      .post(STUDIES + '/', study)
      .then(({ data }) => {
        commit('addStudy', data)
        return data
      })
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
        .post(GROUPS + '/', group)
        // Can't just add the returned value because GET
        // and POST return different JSONs (the POST result)
        // doesn't contain Study as an object but as a url
        .then(({ data }) => dispatch('fetchGroupById', data.id))
        .catch(console.error)
    )
  },
  createSubject({ commit }, subject) {
    return session
      .post(SUBJECTS + '/', subject)
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
  },
  fetchSubjectsDateOfBirthPlot({ commit }) {
    return session
      .get(`${SUBJECTS}/plot/`)
      .then(({ data }) => commit('setSubjectDateOfBirthPlot', data))
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
