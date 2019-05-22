import axios from "axios";

const state = {
  dicomPatients: [],
  dicomSeries: []
};

const getters = {
  patientsAsTreeNodes: state => {
    return state.dicomPatients.map(patient => {
      return {
        id: "dicom_patient_" + String(patient.id),
        name: patient.uid,
        icon: "subject",
        children: []
      };
    });
  }
};

const mutations = {
  setDicomPatients(state, dicomPatients) {
    state.dicomPatients = dicomPatients;
  }
};

const actions = {
  getDicomPatients({ commit }) {
    axios
      .get("/api/dicom/patients/")
      .then(json => commit("setDicomPatients", json.data.results))
      .catch(console.error);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
