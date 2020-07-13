import './filters/date-formatting'
import './filters/datetime-formatting'
import './filters/reseacher-name-formatting'
import './filters/initials-formatting'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueMermaid from 'vue-mermaid'
import vuetify from './plugins/vuetify'
import VS2 from 'vue-script2'
import { required } from 'vuelidate/lib/validators'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueMermaid)
Vue.use(VS2)
require('dotenv').config()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
