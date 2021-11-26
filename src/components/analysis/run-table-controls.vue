<template>
  <v-container flex>
    <v-row>
      <v-col>
        <v-select
          v-model="analysisFilter.value"
          :items="analyses"
          :label="analysisFilter.label"
          item-text="title"
          item-value="id"
          multiple
        />
      </v-col>
      <v-col>
        <v-select
          v-model="analysisVersionFilter.value"
          :disabled="analysisFilter.value.length == 0"
          :items="analysisVersions"
          :label="analysisVersionFilter.label"
          item-text="title"
          item-value="id"
          multiple
        />
      </v-col>
      <v-col :cols="1">
        <v-btn class="info" @click="update">
          <v-icon>
            refresh
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'RunTableControls',
  props: { options: Object, scan: Object },
  created() {
    this.updateAnalysis()
    this.update()
  },
  data: () => ({
    analysisFilter: { label: 'Analysis', value: [] },
    analysisVersionFilter: { label: 'Version', value: [] },
    loadingAnalyses: false,
    loadingAnalysisVersions: false
  }),
  computed: {
    filters: function() {
      return {
        analysis: this.analysisFilter.value,
        analysisVersion: this.analysisVersionFilter.value,
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
    ...mapState('analysis', ['analyses', 'analysisVersions'])
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
    updateAnalysis: function() {
      this.$emit('fetch-analyses-start')
      this.loadingAnalyses = true
      this.fetchAnalyses({
        filters: { hasRuns: true },
        options: {}
      }).then(() => {
        this.loadingAnalyses = false
      })
      this.$emit('fetch-analyses-end')
    },
    updateAnalysisVersions: function() {
      this.$emit('fetch-analysis-versions-start')
      this.loadingAnalysisVersions = true
      this.fetchAnalysisVersions({
        filters: { analysis: this.filters.analysis, hasRuns: true },
        options: {}
      }).then(() => {
        this.loadingAnalysisVersions = false
      })
      this.$emit('fetch-analysis-versions-end')
    },
    ...mapActions('analysis', [
      'fetchAnalyses',
      'fetchAnalysisVersions',
      'fetchRuns'
    ]),
    ...mapActions('mri', ['fetchScanRunSet']),
    ...mapMutations('analysis', ['setAnalysisVersions'])
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
    },
    'analysisFilter.value': function(newValue) {
      if (newValue.length == 0) {
        this.analysisVersionFilter.value = []
        this.setAnalysisVersions([])
      } else {
        this.updateAnalysisVersions()
      }
    }
  }
}
</script>

<style scoped></style>
