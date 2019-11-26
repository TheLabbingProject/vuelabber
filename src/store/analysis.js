import {
  ANALYSES,
  ANALYSIS_VERSIONS,
  CATEGORIES,
  INPUT_DEFINITIONS,
  INPUT_SPECIFICATIONS,
  INPUTS,
  OUTPUT_DEFINITIONS,
  OUTPUT_SPECIFICATIONS,
  OUTPUTS,
  RUNS
} from '@/api/analysis/endpoints'
import {
  getInputDefinitionQueryString,
  getInputsQueryString,
  getOutputDefinitionQueryString,
  getOutputsQueryString
} from '@/api/analysis/query'
import session from '@/api/session'

const state = {
  analyses: [],
  analysisVersions: [],
  categories: [],
  inputSpecifications: [],
  inputDefinitions: [],
  outputSpecifications: [],
  outputDefinitions: [],
  runs: [],
  inputs: [],
  outputs: []
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
  },
  getAnalysisOutputSpecifications(state) {
    return analysis =>
      state.outputSpecifications.filter(
        outputSpecification => outputSpecification.analysis === analysis.url
      )
  },
  getOutputSpecificationByUrl(state) {
    return url =>
      state.outputSpecifications.find(
        outputSpecification => outputSpecification.url === url
      )
  },
  getRunAnalysisVersion(state) {
    return run =>
      state.analysisVersions.find(
        analysisVersion => analysisVersion.url === run.analysisVersion
      )
  },
  getRunAnalysis(state, getters) {
    return run => {
      let analysisVersion = getters['getRunAnalysisVersion'](run)
      return state.analyses.find(
        analysis => analysis.url === analysisVersion.analysis
      )
    }
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
  },
  setOutputSpecifications(state, outputSpecifications) {
    state.outputSpecifications = outputSpecifications
  },
  setOutputDefinitions(state, outputDefinitions) {
    state.outputDefinitions = outputDefinitions
  },
  setRuns(state, runs) {
    state.runs = runs
  },
  setInputs(state, inputs) {
    state.inputs = inputs
  },
  setOutputs(state, outputs) {
    state.outputs = outputs
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
  },
  fetchOutputSpecifications({ commit }) {
    return session
      .get(OUTPUT_SPECIFICATIONS)
      .then(({ data }) => commit('setOutputSpecifications', data.results))
      .catch(console.error)
  },
  fetchOutputDefinitions({ commit }, options) {
    let queryString = getOutputDefinitionQueryString(options)
    return session
      .get(`${OUTPUT_DEFINITIONS}/${queryString}`)
      .then(({ data }) => commit('setOutputDefinitions', data.results))
      .catch(console.error)
  },
  fetchRuns({ commit }) {
    return session
      .get(RUNS)
      .then(({ data }) => commit('setRuns', data.results))
      .catch(console.error)
  },
  fetchInputs({ commit }, options) {
    let queryString = getInputsQueryString(options)
    return session
      .get(`${INPUTS}/${queryString}`)
      .then(({ data }) => commit('setInputs', data.results))
      .catch(console.error)
  },
  fetchOutputs({ commit }, options) {
    let queryString = getOutputsQueryString(options)
    return session
      .get(`${OUTPUTS}/${queryString}`)
      .then(({ data }) => commit('setOutputs', data.results))
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