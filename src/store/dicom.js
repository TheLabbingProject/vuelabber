import axios from 'axios'
const camelcaseKeys = require('camelcase-keys')

const state = {
  patients: [],
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
  setSeriesList(state, seriesList) {
    state.seriesList = seriesList
  },
  setPatients(state, patients) {
    state.patients = patients
  },
  clearSeriesList(state) {
    state.seriesList = []
  },
  updatePatientState(state, patient) {
    state.patients = state.patients.filter(
      existingPatient => existingPatient.id != patient.id
    )
    state.patients.push(patient)
  }
}

const actions = {
  fetchPatients({ commit }) {
    return axios
      .get('/api/dicom/patients/')
      .then(({ data }) =>
        commit('setPatients', data.results.map(item => camelcaseKeys(item)))
      )
      .catch(console.error)
  },
  fetchPatientSeriesList({ commit }, patient) {
    return axios
      .get('/api/dicom/series/?patient__id=' + patient.id)
      .then(({ data }) =>
        commit('setSeriesList', data.results.map(item => camelcaseKeys(item)))
      )
      .catch(console.error)
  },
  updatePatient({ commit }, patient) {
    return axios
      .patch(`/api/dicom/patients/${patient.id}/`, camelToSnakeCase(patient))
      .then(({ data }) => commit('updatePatientState', camelcaseKeys(data)))
      .catch(console.error)
  },
  filterPatients({ commit }, filterString) {
    return axios
      .get(`/api/dicom/patients/?${filterString}`)
      .then(({ data }) =>
        commit('setPatients', data.results.map(item => camelcaseKeys(item)))
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
