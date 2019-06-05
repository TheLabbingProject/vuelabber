import accounts from './accounts'
import auth from './auth'
import dicom from './dicom'
import mri from './mri'
import password from './password'
import research from './research'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    accounts,
    auth,
    dicom,
    mri,
    password,
    research
  }
})
