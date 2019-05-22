import axios from "axios";
import dicomModule from "./dicom";

const state = {
  scans: [],
  NIfTI: [],
  sequenceTypes: [],
  unreviewedDicomPatientsAsTreeNodes: [],
  unreviewedDicomSeriesAsTreeNodes: {}
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
  },
  setUnreviewedDicomPatientsAsTreeNodes(
    state,
    unreviewedDicomPatientsAsTreeNodes
  ) {
    state.unreviewedDicomPatientsAsTreeNodes = unreviewedDicomPatientsAsTreeNodes;
  },
  setUnreviewedDicomSeriesAsTreeNodes(state, data) {
    state.unreviewedDicomSeriesAsTreeNodes[data.patient_id] = data.results;
  }
};

const actions = {
  getScans({ commit }) {
    axios
      .get("/api/mri/scans/")
      .then(json => commit("setScans", json.data.results))
      .catch(console.error);
  },
  getUnreviewedDicomPatientsAsTreeNodes({ commit }) {
    axios
      .get("/api/mri/tree/unreviewed_dicom_patients/")
      .then(json =>
        commit("setUnreviewedDicomPatientsAsTreeNodes", json.data.results)
      )
      .catch(console.error);
  },
  getUnreviewedDicomSeriesAsTreeNodes({ commit }, patient_id) {
    return new Promise((resolve, reject) =>
      axios
        .get("/api/mri/tree/unreviewed_dicom_series/?patient__id=" + patient_id)
        .then(json =>
          commit("setUnreviewedDicomSeriesAsTreeNodes", {
            patient_id,
            results: json.data.results
          })
        )
        .catch(console.error)
    );
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
