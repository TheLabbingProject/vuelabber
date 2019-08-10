import session from '@/api/session'
import { PATIENTS, SERIES } from '@/api/dicom/endpoints'
import { getPatientQueryString, getSeriesQueryString } from '@/api/dicom/query'
const camelcaseKeys = require('camelcase-keys')

const state = {
  patients: [],
  selectedPatientId: null,
  seriesList: []
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
  setSeries(state, seriesList) {
    state.seriesList = seriesList
  },
  setPatients(state, patients) {
    state.patients = patients
  },
  setSelectedPatientId(state, selectedPatientId) {
    state.selectedPatientId = selectedPatientId
  }
}

const actions = {
  fetchPatients({ commit }, { filters, pagination }) {
    let queryString = getPatientQueryString({ filters, pagination })
    return session
      .get(`${PATIENTS}/${queryString}`)
      .then(({ data }) =>
        commit('setPatients', data.results.map(item => camelcaseKeys(item)))
      )
      .catch(console.error)
  },
  fetchSeries({ commit }, { filters, pagination }) {
    let queryString = getSeriesQueryString({ filters, pagination })
    return session
      .get(`${SERIES}/${queryString}`)
      .then(({ data }) =>
        commit('setSeries', data.results.map(item => camelcaseKeys(item)))
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
