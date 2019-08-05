import session from '@/api/session'
import { replaceNull } from '@/utils'
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
  }
}

const actions = {
  fetchPatients({ commit }, { filters, pagination }) {
    let queryString = getPatientQueryString({ filters, pagination })
    return session
      .get(`/api/dicom/patients/?${queryString}`)
      .then(({ data }) =>
        commit('setPatients', data.results.map(item => camelcaseKeys(item)))
      )
      .catch(console.error)
  },
  fetchPatientSeriesList({ commit }, patient) {
    return session
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

const getPatientQueryString = ({ filters, pagination }) => {
  filters = replaceNull(filters)
  pagination = replaceNull(pagination)
  return `id=${filters.id || ''}&uid=${filters.uid ||
    ''}&uid_lookup=icontains&born_after_date=${filters.bornAfter ||
    ''}&born_before_date=${filters.bornBefore ||
    ''}&name_prefix=&given_name=${filters.firstName ||
    ''}&given_name_lookup=icontains&middle_name=&middle_name_lookup=&family_name=${filters.lastName ||
    ''}&family_name_lookup=icontains&name_suffix=&sex=${filters.sex[0] ||
    ''}&page_size=${pagination.rowsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.descending ? '-' + pagination.ordering : pagination.ordering
  }`
}
