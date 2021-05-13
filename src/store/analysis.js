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
  RUNS,
  PIPELINES,
  PIPES,
  NODES
} from '@/api/analysis/endpoints'
import {
  getCategoryQueryString,
  getAnalysisQueryString,
  getAnalysisVersionQueryString,
  getInputDefinitionQueryString,
  getInputSpecificationQueryString,
  getInputsQueryString,
  getOutputDefinitionQueryString,
  getOutputsQueryString,
  getOutputSpecificationQueryString
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
  totalOutputCount: 0,
  runs: [],
  inputs: [],
  outputs: [],
  pipelines: [],
  pipes: [],
  nodes: []
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
  getAnalysisById(state) {
    return analysisId =>
      state.analyses.find(analysis => analysis.id === analysisId)
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
  addCategories(state, categories) {
    state.categories = [...state.categories, ...categories]
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
    state.totalOutputCount = outputs.length
  },
  setPipelines(state, pipelines) {
    state.pipelines = pipelines
  },
  setPipes(state, pipes) {
    state.pipes = pipes
  },
  setNodes(state, nodes) {
    state.nodes = nodes
  }
}

const actions = {
  fetchAnalyses({ commit }, options) {
    let queryString = getAnalysisQueryString(options)
    return session
      .get(`${ANALYSES}/${queryString}`)
      .then(({ data }) => commit('setAnalyses', data.results))
      .catch(console.error)
  },
  fetchAnalysisVersions({ commit }, options) {
    let queryString = getAnalysisVersionQueryString(options)
    return session
      .get(`${ANALYSIS_VERSIONS}/${queryString}`)
      .then(({ data }) => commit('setAnalysisVersions', data.results))
      .catch(console.error)
  },
  fetchCategories({ commit }, options) {
    let queryString = getCategoryQueryString(options)
    let commitMethod = options.append ? 'addCategories' : 'setCategories'
    return session
      .get(`${CATEGORIES}/${queryString}`)
      .then(({ data }) => commit(commitMethod, data.results))
      .catch(console.error)
  },
  fetchInputSpecifications({ commit }, options) {
    let queryString = getInputSpecificationQueryString(options)
    let URL = `${INPUT_SPECIFICATIONS}/${queryString}`
    return session
      .get(URL)
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
  fetchOutputSpecifications({ commit }, options) {
    let queryString = getOutputSpecificationQueryString(options)
    let URL = `${OUTPUT_SPECIFICATIONS}/${queryString}`
    return session
      .get(URL)
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
  },
  fetchPipelines({ commit }) {
    return session
      .get(PIPELINES)
      .then(({ data }) => commit('setPipelines', data.results))
      .catch(console.error)
  },
  fetchPipes({ commit }) {
    return session
      .get(PIPES)
      .then(({ data }) => commit('setPipes', data.results))
      .catch(console.error)
  },
  fetchNodes({ commit }) {
    return session
      .get(NODES)
      .then(({ data }) => commit('setNodes', data.results))
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
