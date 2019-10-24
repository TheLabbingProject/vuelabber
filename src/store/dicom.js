import session from '@/api/session'
import { PATIENTS, SERIES, STUDIES } from '@/api/dicom/endpoints'
import {
  getPatientQueryString,
  getSeriesQueryString,
  getStudyQueryString
} from '@/api/dicom/query'

const state = {
  patients: [],
  patientCount: 0,
  selectedPatientId: null,
  seriesList: [],
  seriesCount: 0,
  studies: [],
  studyCount: 0,
  selectedStudyId: null
}

const getters = {
  getSeriesByUrl(state) {
    return url => state.seriesList.find(series => series.url === url)
  },
  getPatientByUrl(state) {
    return url => state.patients.find(patient => patient.url === url)
  }
}

const mutations = {
  setPatients(state, patients) {
    state.patients = patients
  },
  setPatientCount(state, count) {
    state.patientCount = count
  },
  setSelectedPatientId(state, selectedPatientId) {
    state.selectedPatientId = selectedPatientId
  },
  setSeries(state, seriesList) {
    state.seriesList = seriesList
  },
  setSeriesCount(state, count) {
    state.seriesCount = count
  },
  setStudies(state, studies) {
    state.studies = studies
  },
  setStudyCount(state, count) {
    state.studyCount = count
  },
  setSelectedStudyId(state, selectedStudyId) {
    state.selectedStudyId = selectedStudyId
  }
}

const actions = {
  fetchPatients({ commit }, { filters, pagination }) {
    let queryString = getPatientQueryString({ filters, pagination })
    return session
      .get(`${PATIENTS}/${queryString}`)
      .then(({ data }) => {
        commit('setPatients', data.results)
        commit('setPatientCount', data.count)
      })
      .catch(console.error)
  },
  fetchSeries({ commit }, { filters, pagination }) {
    let queryString = getSeriesQueryString({ filters, pagination })
    return session
      .get(`${SERIES}/${queryString}`)
      .then(({ data }) => {
        commit('setSeries', data.results)
        commit('setSeriesCount', data.count)
        return filters.id ? data.results[0] : data.results
      })
      .catch(console.error)
  },
  fetchStudies({ commit }, { filters, pagination }) {
    let queryString = getStudyQueryString({ filters, pagination })
    return session
      .get(`${STUDIES}/${queryString}`)
      .then(({ data }) => {
        commit('setStudies', data.results)
        commit('setStudyCount', data.count)
      })
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
