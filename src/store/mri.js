import { SCANS, SEQUENCE_TYPES } from '@/api/mri/endpoints'
import session from '@/api/session'
import { arraysEqual, camelToSnakeCase, replaceNull } from '@/utils'
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
  }
}

const actions = {
  fetchScans({ commit }, { filters, pagination }) {
    let queryString = getQueryString({ filters, pagination })
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

const getQueryString = ({ filters, pagination }) => {
  filters = replaceNull(filters)
  pagination = replaceNull(pagination)
  return `?id=&description=${filters.description ||
    ''}&description_lookup=icontains&number=${filters.number ||
    ''}&created_after=&created_before=&scan_time_after=${filters.afterDate ||
    ''}&scan_time_before=${filters.beforeDate ||
    ''}&echo_time=&inversion_time=&repetition_time=&institution_name=&is_updated_from_dicom=&dicom__id=${filters.dicomId ||
    ''}&subject=${filters.subject || ''}&page_size=${pagination.rowsPerPage ||
    100}&page=${pagination.page || 1}&ordering=${
    pagination.descending ? '-' + pagination.sortBy : pagination.sortBy
  }`
}
