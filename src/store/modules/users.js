import axios from "axios";

export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    updateCurrentUser(state, user) {
      state.user = user;
    }
  },
  getters: {},
  actions: {
    signIn({ commit }) {
      axios
        .post("api/api-auth")
        .then(result => commit("updateCurrentUser", result.data))
        .catch(console.error);
    }
  }
};
