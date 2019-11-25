import {
  ANALYSES,
  ANALYSIS_VERSIONS,
  CATEGORIES,
  INPUT_DEFINITIONS,
  INPUT_SPECIFICATIONS
} from '@/api/analysis/endpoints'
import { getInputDefinitionQueryString } from '@/api/analysis/query'
import session from '@/api/session'

const state = {
  analyses: [],
  analysisVersions: [],
  categories: [],
  inputSpecifications: [],
  inputDefinitions: [],
  outputSpecfications: [],
  runs: []
}

const getters = {
  rootCategories(state) {
    return state.categories.filter(category => category.parent == null)
  },
  childCategories(state) {
    return parentCategory =>
      state.categories.filter(
        category => category.parent === parentCategory.url
      )
  },
  categoryAnalyses(state) {
    return category =>
      state.analyses.filter(analysis => analysis.category === category.url)
  },
  getAnalysisById(state) {
    return analysisId =>
      state.analyses.find(analysis => analysis.id === analysisId)
  },
  getAnalysisVersions(state) {
    return analysis =>
      state.analysisVersions.filter(
        analysisVersion => analysisVersion.analysis === analysis.url
      )
  },
  getAnalysisInputSpecifications(state) {
    return analysis =>
      state.inputSpecifications.filter(
        inputSpecification => inputSpecification.analysis === analysis.url
      )
  },
  getInputSpecificationByUrl(state) {
    return url =>
      state.inputSpecifications.find(
        inputSpecification => inputSpecification.url === url
      )
  }
}

const mutations = {
  setAnalyses(state, analyses) {
    state.analyses = analyses
  },
  setAnalysisVersions(state, analysisVersions) {
    state.analysisVersions = analysisVersions
  },
  setCategories(state, categories) {
    state.categories = categories
  },
  setInputSpecifications(state, inputSpecifications) {
    state.inputSpecifications = inputSpecifications
  },
  setInputDefinitions(state, inputDefinitions) {
    state.inputDefinitions = inputDefinitions
  }
}

const actions = {
  fetchAnalyses({ commit }) {
    return session
      .get(ANALYSES)
      .then(({ data }) => commit('setAnalyses', data.results))
      .catch(console.error)
  },
  fetchAnalysisVersions({ commit }) {
    return session
      .get(ANALYSIS_VERSIONS)
      .then(({ data }) => commit('setAnalysisVersions', data.results))
      .catch(console.error)
  },
  fetchCategories({ commit }) {
    return session
      .get(CATEGORIES)
      .then(({ data }) => commit('setCategories', data.results))
      .catch(console.error)
  },
  fetchInputSpecifications({ commit }) {
    return session
      .get(INPUT_SPECIFICATIONS)
      .then(({ data }) => commit('setInputSpecifications', data.results))
      .catch(console.error)
  },
  fetchInputDefinitions({ commit }, options) {
    let queryString = getInputDefinitionQueryString(options)
    return session
      .get(`${INPUT_DEFINITIONS}/${queryString}`)
      .then(({ data }) => commit('setInputDefinitions', data.results))
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
