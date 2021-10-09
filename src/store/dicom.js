import session from '@/api/session'
import {
  PATIENTS,
  SERIES,
  STUDIES,
  MANUFACTURERS,
  seriesToCSV,
  STUDY_AGGREGATIONS,
  PATIENT_AGGREGATIONS
} from '@/api/dicom/endpoints'
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
  studyAggregations: {
    nPatientsMin: 0,
    nPatientsMax: 1,
    nSeriesMin: 0,
    nSeriesMax: 1,
    nImagesMin: 0,
    nImagesMax: 1
  },
  patientAggregations: {
    nStudiesMin: 0,
    nStudiesMax: 1,
    nSeriesMin: 0,
    nSeriesMax: 1,
    nImagesMin: 0,
    nImagesMax: 1
  },
  selectedStudyId: null,
  manufacturersList: []
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
  setPatientAggregations(state, aggregations) {
    state.patientAggregations = aggregations
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
  setStudyAggregations(state, aggregations) {
    state.studyAggregations = aggregations
  },
  setSelectedStudyId(state, selectedStudyId) {
    state.selectedStudyId = selectedStudyId
  },
  setManufacturers(state, manufacturers) {
    state.manufacturersList = manufacturers.map(name =>
      name == undefined ? '' : name
    )
  }
}

const actions = {
  fetchPatients({ commit }, { filters, options }) {
    let queryString = getPatientQueryString({ filters, options })
    return session
      .get(`${PATIENTS}/${queryString}`)
      .then(({ data }) => {
        commit('setPatients', data.results)
        commit('setPatientCount', data.count)
      })
      .catch(console.error)
  },
  fetchSeries({ commit }, { filters, options }) {
    let queryString = getSeriesQueryString({ filters, options })
    return session
      .get(`${SERIES}/${queryString}`)
      .then(({ data }) => {
        commit('setSeries', data.results)
        commit('setSeriesCount', data.count)
        return filters.id ? data.results[0] : data.results
      })
      .catch(console.error)
  },
  fetchStudies({ commit }, { filters, options }) {
    let queryString = getStudyQueryString({ filters, options })
    return session
      .get(`${STUDIES}/${queryString}`)
      .then(({ data }) => {
        commit('setStudies', data.results)
        commit('setStudyCount', data.count)
      })
      .catch(console.error)
  },
  fetchStudyAggregations({ commit }) {
    return session
      .get(STUDY_AGGREGATIONS)
      .then(({ data }) => {
        commit('setStudyAggregations', data)
      })
      .catch(console.error)
  },
  fetchPatientAggregations({ commit }) {
    return session
      .get(PATIENT_AGGREGATIONS)
      .then(({ data }) => {
        commit('setPatientAggregations', data)
      })
      .catch(console.error)
  },
  fetchManufacturers({ commit }) {
    return session
      .get(MANUFACTURERS)
      .then(({ data }) => {
        commit('setManufacturers', data.results)
      })
      .catch(console.error)
  },
  getCSV(actions, { filters, options }) {
    let queryString = getSeriesQueryString({ filters, options })
    let url = `${seriesToCSV}/${queryString}`
    return session
      .get(url, { 'Content-Type': 'multipart/form-data' })
      .then(response => {
        var blob = new Blob([response.data], { type: 'text/csv' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'filtered_scans.csv'
        link.click()
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
