import Vue from 'vue'

Vue.filter('formatJson', function(value) {
  if (value) {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch (error) {
      return JSON.stringify(value, null, 2)
    }
  }
})
