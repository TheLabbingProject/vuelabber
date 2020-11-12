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
    let filters = { run: this.run.id }
    let pagination = {}
    let options = { filters: filters, pagination: pagination }
    this.fetchOutputs(options).then(() => {
      this.loading = false
    })
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
      let filters = { run: selectedRun.id }
      let pagination = {}
      let options = { filters: filters, pagination: pagination }
      this.fetchOutputs(options).then(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
