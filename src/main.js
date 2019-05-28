import './plugins/vuetify'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import BootstrapVue from 'bootstrap-vue'
import Datetime from 'vue-datetime'
import router from './router/index'
import store from './store/index'
import Vue from 'vue'
import 'vue-datetime/dist/vue-datetime.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(AsyncComputed)
Vue.use(BootstrapVue)
Vue.use(Datetime)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
