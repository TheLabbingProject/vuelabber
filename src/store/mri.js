/* eslint-disable */
import {
  IRB_APPROVALS,
  SCANS,
  SESSIONS
} from '@/api/mri/endpoints'
import {
  getIrbApprovalQueryString,
  getScanQueryString,
  getSessionQueryString
} from '@/api/mri/query'
import { arraysEqual, camelToSnakeCase } from '@/utils'
import session from '@/api/session'

const state = {
  scans: [],
  sessions: [],
  scanCount: 0,
  sessionCount: 0,
  scanPreviewLoader: '',
  irbApprovals: [],
  irbApprovalsCount: 0
}

const getters = {
  getScanByDicomSeries(state) {
    return series => state.scans.find(scan => scan.dicom === series.url)
  }
}

const mutations = {
  setScans(state, scans) {
    state.scans = scans
  },
  setScanCount(state, count) {
    state.scanCount = count
  },
  setSessions(state, sessions) {
    state.sessions = sessions
  },
  setIrbApprovals(state, irbApprovals) {
    state.irbApprovals = irbApprovals
  },
  setIrbApprovalsCount(state, count) {
    state.irbApprovalsCount = count
  },
  setSessionCount(state, count) {
    state.sessionCount = count
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
  updateSessionState(state, updatedSession) {
    let index = state.sessions.indexOf(
      state.sessions.find(session => session.id === updatedSession.id)
    )
    // Mutating an array directly causes reactivity problems
    let newSessions = state.sessions.slice()
    newSessions[index] = updatedSession
    state.sessions = newSessions
  },
  setScanPreviewLoader(state, script) {
    state.scanPreviewLoader = script
  },
  clearScanPreviewLoader(state) {
    state.scanPreviewLoader = ''
  }
}

const actions = {
  fetchScans({ commit }, { filters, options }) {
    commit('setScans', [])
    let queryString = getScanQueryString({ filters, options })
    return session
      .get(`${SCANS}/${queryString}`)
      .then(({ data }) => {
        commit('setScans', data.results)
        commit('setScanCount', data.count)
      })
      .catch(console.error)
  },
  fetchIrbApprovals({ commit }, query) {
    commit('setIrbApprovals', [])
    let queryString = getIrbApprovalQueryString(query)
    let URL = `${IRB_APPROVALS}/${queryString}`
    return session
      .get(URL)
      .then(({ data }) => {
        commit('setIrbApprovals', data.results)
        commit('setIrbApprovalsCount', data.count)
      })
      .catch(console.error)
  },
  fetchSessions({ commit }, query) {
    commit('setSessions', [])
    let queryString = getSessionQueryString(query)
    return session
      .get(`${SESSIONS}/${queryString}`)
      .then(({ data }) => {
        commit('setSessions', data.results)
        commit('setSessionCount', data.count)
      })
      .catch(console.error)
  },
  getOrCreateScanFromDicomSeries({ commit }, dicomSeries) {
    return session
      .post(SCANS, { dicom: dicomSeries.url })
      .then(({ data }) => {
        commit('addScan', data)
        return data
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
      .then(({ data }) => {
        commit('addScan', data)
        return data
      })
      .catch(console.error)
  },
  deleteScan({ commit }, scan) {
    let URL = `${SCANS}/${scan.id}/`
    return session
      .delete(URL)
      .then(() => commit('removeScanFromState', scan))
      .catch(console.error)
  },
  updateScan({ commit }, data) {
    let { scanId, ...dataWithoutId } = data
    let URL = `${SCANS}/${scanId}/`
    return session
      .patch(URL, dataWithoutId)
      .then(({ data }) => {
        commit('updateScanState', data)
      })
      .catch(console.error)
  },
  patchSession({ commit }, data) {
    let { sessionId, ...dataWithoutId } = data
    let URL = `${SESSIONS}/${sessionId}/`
    return session
      .patch(URL, dataWithoutId)
      .then(({ data }) => {
        commit('updateSessionState', data)
        return true
      })
      .catch(console.error)
  },
  fetchScanPreviewLoader({ commit }, scanId) {
    return session
      .get(`${SCANS}/${scanId}/plot`)
      .then(({ data }) => {
        commit('setScanPreviewLoader', data)
      })
      .catch(console.error)
  },
  fetchScanRunSet({ commit }, scanId) {
    return session
      .get(`${SCANS}/${scanId}/runs`)
      .then(({ data }) => {
        commit('analysis/setRuns', data, { root: true })
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
