import axios from "axios";
import dicomModule from "./dicom";

const state = {
  scans: [],
  NIfTI: [],
  sequenceTypes: []
};

const getters = {};

const mutations = {
  setScans(state, scans) {
    state.scans = scans;
  },
  setNIfTI(state, NIfTI) {
    state.NIfTI = NIfTI;
  },
  setSequenceTypes(state, sequenceTypes) {
    state.sequenceTypes = sequenceTypes;
  }
};

const actions = {
  getScans({ commit }) {
    axios
      .get("/api/mri/scans/")
      .then(json => commit("setScans", json.data.results))
      .catch(console.error);
  }
};

export default {
  namespaced: true,
  modules: {
    dicom: dicomModule
  },
  state,
  mutations,
  actions,
  getters
};
