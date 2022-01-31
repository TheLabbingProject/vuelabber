<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col class="pt-0">
        <v-autocomplete
          v-model="analysisFilter.value"
          :items="analyses"
          :label="analysisFilter.label"
          item-text="title"
          item-value="id"
          multiple
          clearable
          deletable-chips
          small-chips
        />
      </v-col>
      <v-col class="pt-0">
        <v-autocomplete
          v-model="analysisVersionFilter.value"
          :disabled="analysisFilter.value.length == 0"
          :items="analysisVersionItems"
          :label="analysisVersionFilter.label"
          item-value="id"
          multiple
          clearable
          deletable-chips
          small-chips
        />
      </v-col>
      <v-col class="pt-0">
        <v-autocomplete
          v-model="statusFilter.value"
          :items="statusFilter.items"
          :label="statusFilter.label"
          multiple
          clearable
        />
      </v-col>
      <v-col :cols="1">
        <v-btn :class="refreshButton.class" @click="update" small>
          <v-icon>
            {{ refreshButton.icon }}
          </v-icon>
        </v-btn>
      </v-col>
      <!-- Export Button -->
      <v-col :cols="1" class="text-left">
        <div>
          <v-dialog v-model="exportRunDataDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
                small
                :disabled="!allowExport"
                :dark="allowExport"
              >
                Export
              </v-btn>
            </template>
            <export-run-card
              :selectedRuns="selectedRuns"
              @close-run-export-dialog="closeRunExportDialog"
              @run-export-started="showExportSnackbar"
            />
          </v-dialog>
        </div>

        <v-snackbar v-model="exportSnackbar" :timeout="exportSnackbarTimeout">
          {{ exportSnackbarText }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="blue"
              text
              v-bind="attrs"
              @click="exportSnackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ExportRunCard from '@/components/analysis/export-run-card'

export default {
  name: 'RunTableControls',
  mounted() {
    this.update().then(() => {
      this.updateAnalysis().then(() => {
        this.fetchExportDestinations(this.exportDestinationQuery)
      })
    })
  },
  props: {
    options: Object,
    scan: Object,
    subject: Object,
    selectedRuns: Array
  },
  components: { ExportRunCard },
  data: () => ({
    analysisFilter: { label: 'Analysis', value: [] },
    analysisVersionFilter: { label: 'Version', value: [] },
    statusFilter: {
      label: 'Status',
      value: [],
      items: [
        { text: 'Started', value: 'STARTED' },
        { text: 'Success', value: 'SUCCESS' },
        { text: 'Failure', value: 'FAILURE' }
      ]
    },
    loadingAnalyses: false,
    loadingAnalysisVersions: false,
    refreshButton: { icon: 'refresh', class: 'info' },
    exportRunDataDialog: false,
    exportSnackbar: false,
    exportSnackbarTimeout: 5000,
    exportSnackbarText: ''
  }),
  computed: {
    filters: function() {
      return {
        analysis: this.analysisFilter.value,
        analysisVersion: this.analysisVersionFilter.value,
        status: this.statusFilter.value,
        startTimeAfter: '',
        startTimeBefore: '',
        endTimeAfter: '',
        endTimeBefore: '',
        subjectId: this.subject ? this.subject.id : ''
      }
    },
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    analysisVersionItems: function() {
      return this.analysisVersions.map(version => ({
        text: `${version.analysis.title} v${version.title}`,
        ...version
      }))
    },
    exportDestinationQuery: function() {
      return {
        filters: { user: this.currentUser.id },
        options: {}
      }
    },
    allowExport: function() {
      return Boolean(this.exportDestinations.length && this.selectedRuns.length)
    },
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('analysis', ['analyses', 'analysisVersions']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    update: function() {
      this.$emit('fetch-run-start')
      if (this.scan != undefined) {
        return this.fetchScanRunSet(this.scan.id).then(() => {
          this.$emit('fetch-run-end')
        })
      } else {
        return this.fetchRuns(this.query).then(() => {
          this.$emit('fetch-run-end')
        })
      }
    },
    updateAnalysis: function() {
      this.$emit('fetch-analyses-start')
      this.loadingAnalyses = true
      return this.fetchAnalyses({
        filters: { hasRuns: true },
        options: {}
      }).then(() => {
        this.loadingAnalyses = false
        this.$emit('fetch-analyses-end')
      })
    },
    updateAnalysisVersions: function() {
      this.$emit('fetch-analysis-versions-start')
      this.loadingAnalysisVersions = true
      return this.fetchAnalysisVersions({
        filters: { analysis: this.filters.analysis, hasRuns: true },
        options: {}
      }).then(() => {
        this.loadingAnalysisVersions = false
        this.$emit('fetch-analysis-versions-end')
      })
    },
    closeRunExportDialog() {
      this.exportRunDataDialog = false
    },
    showExportSnackbar(nRuns, nExportDestinations) {
      let exportDestinationsText =
        'destination' + (nExportDestinations > 1 ? 's' : '')
      let runText = 'run' + (nRuns > 1 ? 's' : '')
      this.exportSnackbarText = `Run results export successfully started! (${nRuns} ${runText}, ${nExportDestinations} ${exportDestinationsText})`
      this.exportSnackbar = true
    },
    ...mapActions('accounts', ['fetchExportDestinations']),
    ...mapActions('analysis', [
      'fetchAnalyses',
      'fetchAnalysisVersions',
      'fetchRuns',
      'setAnalysisVersions'
    ]),
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
