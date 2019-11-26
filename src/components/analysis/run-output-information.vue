<template>
  <v-data-table
    item-key="id"
    hide-default-footer
    :headers="headers"
    :items="outputs"
    :loading="loading"
  >
  </v-data-table>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'RunOutputInformation',
  props: { run: Object },
  data: () => ({
    headers: [
      { text: 'Key', value: 'key', width: 160 },
      { text: 'Value', value: 'value' }
    ],
    loading: false
  }),
  created() {
    this.loading = true
    this.fetchOutputs({ filters: { run: this.run.id }, pagination: {} })
    this.loading = false
  },
  computed: {
    ...mapState('analysis', ['outputs'])
  },
  methods: {
    ...mapActions('analysis', ['fetchOutputs'])
  },
  watch: {
    run: function(selectedRun) {
      this.loading = true
      this.fetchOutputs({ filters: { run: selectedRun.id }, pagination: {} })
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
