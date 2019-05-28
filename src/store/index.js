import auth from './auth'
import password from './password'
import Vue from 'vue'
import Vuex from 'vuex'
import usersModule from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    password,
    users: usersModule
  }
})
