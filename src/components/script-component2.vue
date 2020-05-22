<template>
  <div>
    {{ editedScript }}
  </div>
</template>

<script>
export default {
  name: 'ScriptComponent2',
  props: {
    script: String
  },
  computed: {
    editedScript: function() {
      /* eslint-disable no-useless-escape */
      return this.script
        .replace('<script', '<script2')
        .replace('<\/script', '<\/script2')
      /* eslint-enable no-useless-escape */
    }
  }
}
</script>

<style></style>
