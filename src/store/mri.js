/* eslint-disable */
import { SCANS, SEQUENCE_TYPES, SEQUENCE_TYPE_DEFINITIONS } from '@/api/mri/endpoints'
import { getScanQueryString } from '@/api/mri/query'
import { arraysEqual, camelToSnakeCase, arrayAdder } from '@/utils'
import session from '@/api/session'


const state = {
  sequenceTypes: [],
  scans: [],
  totalScanCount: 0,
  scanPreviewLoader: ''
}

const getters = {
  getScanByDicomSeries(state) {
    return series => state.scans.find(scan => scan.dicom === series.url)
  },
  getDicomSeriesSequenceType(state) {
    return series =>
      state.sequenceTypes.find(
        item =>
          arraysEqual(item.sequenceTypeDefinitions.scanningSequence, series.scanningSequence) &&
          arraysEqual(item.sequenceTypeDefinitions.sequenceVariant, series.sequenceVariant)
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
  createSequenceType(state, sequenceType) {
    state.sequenceTypes.push(sequenceType)
  },
  removeSequenceTypeFromState(state, removedSequence) {
    state.sequenceTypes = state.sequenceTypes.filter(
      sequence => sequence.id != removedSequence.id
    )
  },
  updateSequenceTypeState(state, updatedSequenceType) {
    let index = state.sequenceTypes.indexOf(
      state.sequenceTypes.find(
        sequence => sequence.id === updatedSequenceType.id
      )
    )
    // Mutating an array directly causes reactivity problems
    let updatedSequenceTypes = state.sequenceTypes.slice()
    updatedSequenceTypes[index] = updatedSequenceType
    state.sequenceTypes = updatedSequenceTypes
  },
  createSequenceTypeDefinition(state, sequenceTypeDefinition) {
    let index = state.sequenceTypes.indexOf(
      state.sequenceTypes.find(
        definition => definition.id === sequenceTypeDefinition.id
      )
    )
    delete sequenceTypeDefinition['sequence_id']
    state.sequenceTypes[index].sequenceTypeDefinitions.push(sequenceTypeDefinition)
  },
  updateSequenceTypeDefinitionState(state, updatedSequenceTypeDefinition) {
    let index = state.sequenceTypes.indexOf(
      state.sequenceTypes.find(
        seq => seq.id === updatedSequenceTypeDefinition.sequenceId
      )
    )
    let updatedSequenceTypeDefinitions = state.sequenceTypes[index].sequenceTypeDefinitions.slice()
    let definition_index = updatedSequenceTypeDefinitions.indexOf(
      updatedSequenceTypeDefinitions.find(
        definition => definition.id === updatedSequenceTypeDefinition
      )
    )
    delete updatedSequenceTypeDefinition['sequence_id']
    updatedSequenceTypeDefinitions[definition_index] = updatedSequenceTypeDefinition
    state.sequenceTypes[index].sequenceTypeDefinitions = updatedSequenceTypeDefinitions
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
    let queryString = getScanQueryString({ filters, options })
    return session
      .get(`${SCANS}/${queryString}`)
      .then(({ data }) => {
        commit('setScans', data.results)
        commit('setTotalScanCount', data.count)
        // return data.results
      })
      // .then(scans => {
      //   commit('setScans', scans)
      // })
      .catch(console.error)
  },
  fetchSequenceTypes({ commit }) {
    return session
      .get(SEQUENCE_TYPES)
      .then(({ data }) => commit('setSequenceTypes', data.results))
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
    return session
      .delete(`${SCANS}/${scan.id}/`)
      .then(() => commit('removeScanFromState', scan))
      .catch(console.error)
  },
  updateScan({ commit }, scan) {
    return session
      .patch(`${SCANS}/${scan.id}/`, scan)
      .then(({ data }) => {
        commit('updateScanState', data)
      })
      .catch(console.error)
  },
  createSequenceType({ commit }, sequenceType) {
    let sequenceTypeInput = {
      'title': sequenceType.title,
      'description': sequenceType.description,
      'scanning_sequence': sequenceType.scanningSequence,
      'sequence_variant': sequenceType.sequenceVariant
    }
    return session
      .post(SEQUENCE_TYPES, sequenceTypeInput)
      .then(({ data }) => {
        commit('addSequenceType', data)
      })
      .catch(console.error)
  },
  deleteSequenceType({ commit }, sequenceType) {
    return session
      .delete(`${SEQUENCE_TYPES}/${sequenceType.id}/`)
      .then(() => commit('removeSequenceTypeFromState', sequenceType))
      .catch(console.error)
  },
  updateSequenceType({ commit }, sequenceType) {
    let sequenceTypeArgs = { 'title': sequenceType.title, 'description': sequenceType.description }
    return session
      .patch(`${SEQUENCE_TYPES}/${sequenceType.id}/`, sequenceTypeArgs)
      .then(({ data }) => {
        commit('updateSequenceTypeState', data, sequenceType)
      })
      .catch(console.error)
  },
  createSequenceTypeDefinition({ commit }, sequenceTypeDefinition) {
    let sequenceTypeDefinitionArgs = {
      'sequence_id': sequenceTypeDefinition.sequenceId,
      'sequence_variant': sequenceTypeDefinition.sequenceVariant,
      'scanning_sequence': sequenceTypeDefinition.scanningSequence
    }
    return session.post(`${SEQUENCE_TYPE_DEFINITIONS}/`, sequenceTypeDefinitionArgs)
      .then(({ data }) => { commit('updateSequenceTypeDefinitionState', data, sequenceTypeDefinition) })
      .catch(console.error)
  },
  updateSequenceTypeDefinition({ commit }, sequenceTypeDefinition) {

  },
  fetchScanPreviewLoader({ commit }, scanId) {
    return session
      .get(`${SCANS}/${scanId}/plot`)
      .then(({ data }) => {
        commit('setScanPreviewLoader', data)
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
