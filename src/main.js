import './plugins/vuetify'
import App from './App.vue'
import Datetime from 'vue-datetime'
import router from './router/index'
import store from './store/index'
import Vue from 'vue'
import './plugins/vuetify'
import './plugins/vuetify'
import './plugins/vuetify'
import Vuelidate from 'vuelidate'
import 'vue-datetime/dist/vue-datetime.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(Datetime)
Vue.use(Vuelidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
