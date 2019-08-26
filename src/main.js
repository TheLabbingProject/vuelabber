import './filters/date-formatting'
import './filters/reseacher-name-formatting'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import Vue from 'vue'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false
Vue.use(Vuelidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
