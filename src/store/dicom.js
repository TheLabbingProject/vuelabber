import axios from 'axios'
const camelcaseKeys = require('camelcase-keys')

const state = {
  seriesList: []
}

const getters = {
  getSeriesList: state => state.seriesList
}

const mutations = {
  setSeriesList(state, seriesList) {
    state.seriesList = seriesList
  },
  clearSeriesList(state) {
    state.seriesList = []
  }
}

const actions = {
  fetchPatientSeriesList({ commit }, patient) {
    axios
      .get('/api/dicom/series/?patient__id=' + patient.id)
      .then(({ data }) =>
        commit('setSeriesList', data.results.map(item => camelcaseKeys(item)))
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
