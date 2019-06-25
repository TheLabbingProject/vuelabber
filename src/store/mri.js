import axios from 'axios'
import Vue from 'vue'
const camelcaseKeys = require('camelcase-keys')

const state = {
  sequenceTypes: [],
  seriesToScan: {},
  scanInfo: {}
}

const getters = {
  getSequenceTypeByUrl(state) {
    return url => state.sequenceTypes.find(sequence => sequence.url === url)
  },
  getScanByDicomSeries(state) {
    return dicomSeries => state.seriesToScan[dicomSeries.id]
  },
  getDicomSeriesSequenceType(state) {
    return series =>
      state.sequenceTypes.find(
        item =>
          arraysEqual(item.scanningSequence, series.scanningSequence) &&
          arraysEqual(item.sequenceVariant, series.sequenceVariant)
      )
  },
  getStudyGroupsByDicomSeries(state) {
    return function(series) {
      if (state.seriesToScan[series.id]) {
        return state.seriesToScan[series.id].studyGroups
      } else {
        return []
      }
    }
  }
}

const mutations = {
  setSequenceTypes(state, sequenceTypes) {
    state.sequenceTypes = sequenceTypes
  },
  updateSeriesToScan(state, { seriesId, scan }) {
    Vue.set(state.seriesToScan, seriesId, scan)
  },
  addGroupToScan(state, { dicomSeries, group }) {
    let updated = state.seriesToScan[dicomSeries.id].studyGroups.concat(
      group.url
    )
    Vue.set(state.seriesToScan[dicomSeries.id], 'studyGroups', updated)
  },
  clearSeriesToScan(state) {
    state.seriesToScan = {}
  },
  updateScanInfo(state, scanInfo) {
    state.scanInfo = scanInfo
  }
}

const actions = {
  fetchSequenceTypes({ commit }) {
    return axios
      .get('/api/mri/sequence_type/')
      .then(({ data }) => data.results.map(item => camelcaseKeys(item)))
      .then(sequenceTypes => commit('setSequenceTypes', sequenceTypes))
      .catch(console.error)
  },
  fetchScanByDicomSeries({ commit }, series) {
    return axios
      .get('/api/mri/scan/?dicom__id=' + series.id)
      .then(({ data }) => (data.count ? camelcaseKeys(data.results[0]) : null))
      .then(scan => commit('updateSeriesToScan', { seriesId: series.id, scan }))
      .catch(console.error)
  },
  updateSeriesToScan({ dispatch }, seriesList) {
    seriesList.forEach(series => dispatch('fetchScanByDicomSeries', series))
  },
  getOrCreateScanFromDicomSeries({ commit }, dicomSeries) {
    return axios
      .post('/api/mri/scan/', { dicom: dicomSeries.url })
      .then(({ data }) => {
        commit('updateSeriesToScan', {
          seriesId: dicomSeries.id,
          scan: camelcaseKeys(data)
        })
        return data
      })
      .catch(console.error)
  },
  getOrCreateScanInfoFromDicomSeries({ commit }, dicomSeries) {
    return axios
      .get(`/api/mri/scan/from_dicom/${dicomSeries.id}/`)
      .then(({ data }) => {
        commit('updateScanInfo', camelcaseKeys(data))
      })
      .catch(console.error)
  },
  associateDicomSeriesToStudyGroups(
    { commit, dispatch, state },
    { dicomSeries, studyGroups }
  ) {
    dispatch('getOrCreateScanFromDicomSeries', dicomSeries)
      .then(() => {
        let scan = state.seriesToScan[dicomSeries.id]
        let groupUrls = studyGroups.map(group => group.url)
        let updatedGroups = [...new Set(scan.studyGroups.concat(groupUrls))]
        axios
          .patch(`/api/mri/scan/${scan.id}/`, {
            study_groups: updatedGroups
          })
          .then(({ data }) =>
            commit('updateSeriesToScan', {
              seriesId: dicomSeries.id,
              scan: camelcaseKeys(data)
            })
          )
          .catch(console.error)
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
