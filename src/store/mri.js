import axios from 'axios'
const camelcaseKeys = require('camelcase-keys')

const state = {
  sequenceTypes: [],
  seriesToScan: {}
}

const getters = {
  getDicomSeriesSequenceType(state) {
    return series =>
      state.sequenceTypes.find(
        item =>
          arraysEqual(item.scanningSequence, series.scanningSequence) &&
          arraysEqual(item.sequenceVariant, series.sequenceVariant)
      )
  }
}

const mutations = {
  setSequenceTypes(state, sequenceTypes) {
    state.sequenceTypes = sequenceTypes
  },
  updateScanList(state, { seriesId, scan }) {
    state.seriesToScan = Object.assign({}, state.seriesToScan, {
      [seriesId]: scan
    })
  },
  clearSeriesToScan(state) {
    state.seriesToScan = {}
  }
}

const actions = {
  fetchSequenceTypes({ commit }) {
    axios
      .get('/api/mri/sequence_type/')
      .then(({ data }) => data.results.map(item => camelcaseKeys(item)))
      .then(sequenceTypes => commit('setSequenceTypes', sequenceTypes))
      .catch(console.error)
  },
  fetchScanByDicomSeries({ commit }, series) {
    axios
      .get('/api/mri/scan/?dicom__id=' + series.id)
      .then(({ data }) => (data.count ? camelcaseKeys(data.results[0]) : null))
      .then(scan => commit('updateScanList', { seriesId: series.id, scan }))
      .catch(console.error)
  },
  updateSeriesToScan({ dispatch }, seriesList) {
    seriesList.forEach(series => dispatch('fetchScanByDicomSeries', series))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

function arraysEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length != b.length) return false

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}
