<template>
  <div>
    <div :id="compId"></div>
  </div>
</template>

<script>
import postscribe from 'postscribe'
var ready = require('document-ready')

export default {
  name: 'ScriptComponent',
  props: {
    script: {
      type: String,
      default: null
    }
  },
  data: () => ({
    randomID: Math.random()
      .toString(36)
      .substring(7)
  }),
  computed: {
    compId: function() {
      return window.performance.now() + '-' + this.randomID
    }
  },
  mounted() {
    /* eslint-disable no-unused-vars */
    var vm = this
    ready(function() {
      let addEl = new Promise((resolve, reject) => {
        postscribe(`#${vm.compId}`, `${vm.script}`, {
          done: function(x) {
            resolve(x)
          },
          afterAsync: function() {
            console.log('Script loaded')
            vm.$emit('script-load-end')
          }
        })
        resolve()
      })
      addEl.then(function(result) {
        // do nothing
      })
    })
    /* eslint-enable no-unused-vars */
  }
}
</script>

<style scoped></style>
