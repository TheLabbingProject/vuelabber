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
  getOutputSpecificationQueryString,
  getRunQueryString
} from '@/api/analysis/query'
import session from '@/api/session'

const state = {
  analyses: [],
  analysesCount: 0,
  analysisVersions: [],
  categories: [],
  inputSpecifications: [],
  inputDefinitions: [],
  outputSpecifications: [],
  outputDefinitions: [],
  runs: [],
  runCount: 0,
  inputs: [],
  inputCount: 0,
  outputs: [],
  outputCount: 0,
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
  setAnalysesCount(state, count) {
    state.analysesCount = count
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
  setRunCount(state, count) {
    state.runCount = count
  },
  setInputs(state, inputs) {
    state.inputs = inputs
  },
  setOutputs(state, outputs) {
    state.outputs = outputs
  },
  setPipelines(state, pipelines) {
    state.pipelines = pipelines
  },
  setPipes(state, pipes) {
    state.pipes = pipes
  },
  setNodes(state, nodes) {
    state.nodes = nodes
  },
  setOutputCount(state, count) {
    state.outputCount = count
  },
  setInputCount(state, count) {
    state.inputCount = count
  }
}

const actions = {
  fetchAnalyses({ commit }, options) {
    let queryString = getAnalysisQueryString(options)
    return session
      .get(`${ANALYSES}/${queryString}`)
      .then(({ data }) => {
        commit('setAnalyses', data.results)
        commit('setAnalysesCount', data.count)
      })
      .catch(console.error)
  },
  fetchAnalysisVersions({ commit }, query) {
    let queryString = getAnalysisVersionQueryString(query)
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
  fetchRuns({ commit }, query) {
    let queryString = getRunQueryString(query)
    return session
      .get(`${RUNS}/${queryString}`)
      .then(({ data }) => {
        commit('setRuns', data.results)
        commit('setRunCount', data.count)
      })
      .catch(console.error)
  },
  fetchInputs({ commit }, query) {
    let queryString = getInputsQueryString(query)
    return session
      .get(`${INPUTS}/${queryString}`)
      .then(({ data }) => {
        commit('setInputs', data.results)
        commit('setInputCount', data.count)
      })
      .catch(console.error)
  },
  fetchOutputs({ commit }, query) {
    let queryString = getOutputsQueryString(query)
    return session
      .get(`${OUTPUTS}/${queryString}`)
      .then(({ data }) => {
        commit('setOutputs', data.results)
        commit('setOutputCount', data.count)
      })
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
