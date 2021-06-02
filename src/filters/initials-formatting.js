import Vue from 'vue'

Vue.filter('CapitalizeInitials', initials => {
  return initials.toUpperCase()
})
