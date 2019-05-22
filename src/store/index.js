import Vue from "vue";
import Vuex from "vuex";
import mriModule from "./modules/mri";
import usersModule from "./modules/users";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    mri: mriModule,
    users: usersModule
  }
});
