import { ANALYSES, CATEGORIES } from '@/api/analysis/endpoints'
import session from '@/api/session'

const state = {
  analyses: [],
  analysisVersions: [],
  categories: [],
  inputSpecifications: [],
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
  }
}

const mutations = {
  setAnalyses(state, analyses) {
    state.analyses = analyses
  },
  setCategories(state, categories) {
    state.categories = categories
  }
}

const actions = {
  fetchAnalyses({ commit }) {
    return session
      .get(ANALYSES)
      .then(({ data }) => commit('setAnalyses', data.results))
      .catch(console.error)
  },
  fetchCategories({ commit }) {
    return session
      .get(CATEGORIES)
      .then(({ data }) => commit('setCategories', data.results))
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
