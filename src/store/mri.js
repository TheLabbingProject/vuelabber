import { SCANS, SEQUENCE_TYPES } from '@/api/mri/endpoints'
import { getScanQueryString } from '@/api/mri/query'
import { arraysEqual, camelToSnakeCase } from '@/utils'
import session from '@/api/session'
const camelcaseKeys = require('camelcase-keys')

const state = {
  sequenceTypes: [],
  scans: [],
  totalScanCount: 0
}

const getters = {
  getSequenceTypeByUrl(state) {
    return url => state.sequenceTypes.find(sequence => sequence.url === url)
  },
  getScanByDicomSeries(state) {
    return series => state.scans.find(scan => scan.dicom === series.url)
  },
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
  setScans(state, scans) {
    state.scans = scans
  },
  setTotalScanCount(state, count) {
    state.totalScanCount = count
  },
  addScan(state, scan) {
    state.scans.push(scan)
  },
  removeScanFromState(state, removedScan) {
    state.scans = state.scans.filter(scan => scan.id != removedScan.id)
  },
  updateScanState(state, updatedScan) {
    let index = state.scans.indexOf(
      state.scans.find(scan => scan.id === updatedScan.id)
    )
    // Mutating an array directly causes reactivity problems
    let newScans = state.scans.slice()
    newScans[index] = updatedScan
    state.scans = newScans
  },
  addSequenceType(state, sequenceType) {
    state.sequenceTypes.push(sequenceType)
  },
  removeSequenceTypeFromState(state, removedSequence) {
    state.sequenceTypes = state.sequenceTypes.filter(
      sequence => sequence.id != removedSequence.id
    )
  }
}

const actions = {
  fetchScans({ commit }, { filters, pagination }) {
    let queryString = getScanQueryString({ filters, pagination })
    return session
      .get(`${SCANS}/${queryString}`)
      .then(({ data }) => {
        commit('setTotalScanCount', data.count)
        return data.results.map(item => camelcaseKeys(item))
      })
      .then(scans => {
        commit('setScans', scans)
      })
      .catch(console.error)
  },
  fetchSequenceTypes({ commit }) {
    return session
      .get(SEQUENCE_TYPES)
      .then(({ data }) => data.results.map(item => camelcaseKeys(item)))
      .then(sequenceTypes => commit('setSequenceTypes', sequenceTypes))
      .catch(console.error)
  },
  getOrCreateScanFromDicomSeries({ commit }, dicomSeries) {
    return session
      .post(SCANS, { dicom: dicomSeries.url })
      .then(({ data }) => camelcaseKeys(data))
      .then(data => {
        commit('addScan', data)
        return data
      })
      .catch(console.error)
  },
  getOrCreateScanInfoFromDicomSeries(context, dicomSeries) {
    return session
      .get(`${SCANS}/from_dicom/${dicomSeries.id}/`)
      .then(({ data }) => {
        return camelcaseKeys(data)
      })
      .catch(console.error)
  },
  associateDicomSeriesToStudyGroups(
    { commit, dispatch, getters },
    { dicomSeries, studyGroups }
  ) {
    dispatch('getOrCreateScanFromDicomSeries', dicomSeries)
      .then(() => {
        let scan = getters['getScanByDicomSeries'](dicomSeries)
        let groupUrls = studyGroups.map(group => group.url)
        let updatedGroups = [...new Set(scan.studyGroups.concat(groupUrls))]
        session
          .patch(`${SCANS}/${scan.id}/`, {
            study_groups: updatedGroups
          })
          .then(({ data }) => {
            commit('removeScanFromState', data)
            commit('addScan', data)
          })
          .catch(console.error)
      })
      .catch(console.error)
  },
  createScan({ commit }, scan) {
    return session
      .post(SCANS, camelToSnakeCase(scan))
      .then(({ data }) => camelcaseKeys(data))
      .then(data => {
        commit('addScan', data)
        return data
      })
      .catch(console.error)
  },
  deleteScan({ commit }, scan) {
    return session
      .delete(`${SCANS}/${scan.id}/`)
      .then(() => commit('removeScanFromState', scan))
      .catch(console.error)
  },
  updateScan({ commit }, scan) {
    return session
      .patch(`${SCANS}/${scan.id}/`, camelToSnakeCase(scan))
      .then(({ data }) => camelcaseKeys(data))
      .then(updatedScan => {
        commit('updateScanState', updatedScan)
      })
      .catch(console.error)
  },
  fetchPlot() {
    return session.get(`${SCANS}/plot/1/`).catch(console.error)
  },
  createSequenceType({ commit }, sequenceType) {
    return session
      .post(SEQUENCE_TYPES, camelToSnakeCase(sequenceType))
      .then(({ data }) => camelcaseKeys(data))
      .then(data => commit('addSequenceType', data))
      .catch(console.error)
  },
  deleteSequenceType({ commit }, sequenceType) {
    return session
      .delete(`${SEQUENCE_TYPES}/${sequenceType.id}/`)
      .then(() => commit('removeSequenceTypeFromState', sequenceType))
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
