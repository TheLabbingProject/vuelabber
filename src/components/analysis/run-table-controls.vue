<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select
          multiple
          :label="analysisFilter.label"
          v-model="analysisFilter.value"
          :items="analyses"
          item-text="title"
          item-value="id"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'RunTableControls',
  props: { options: Object, scan: Object },
  created() {
    this.fetchAnalyses({ filters: { hasRuns: true }, options: {} })
    this.update()
  },
  data: () => ({
    analysisFilter: { label: 'Analysis', value: [] }
  }),
  computed: {
    filters: function() {
      return {
        analysis: this.analysisFilter.value,
        analysisVersion: [],
        status: [],
        startTimeAfter: '',
        startTimeBefore: '',
        endTimeAfter: '',
        endTimeBefore: ''
      }
    },
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    ...mapState('analysis', ['analyses'])
  },
  methods: {
    update: function() {
      this.$emit('fetch-run-start')
      if (this.scan != undefined) {
        this.fetchScanRunSet(this.scan.id).then(() => {
          this.$emit('fetch-run-end')
        })
      } else {
        this.fetchRuns(this.query).then(() => {
          this.$emit('fetch-run-end')
        })
      }
    },
    ...mapActions('analysis', ['fetchAnalyses', 'fetchRuns']),
    ...mapActions('mri', ['fetchScanRunSet'])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    options: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
