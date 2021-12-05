<template>
  <v-container fluid class="pt-2">
    <!-- Subject Information -->
    <v-row v-if="showPersonalInformationFilters" class="pa-0">
      <!-- Subject ID Number -->
      <v-col>
        <v-text-field
          autofocus
          clearable
          v-model="filters.subjectIdNumber"
          label="Subject ID"
          dense
        />
      </v-col>
      <!-- Subject First Name -->
      <v-col>
        <v-text-field
          clearable
          v-model="filters.subjectFirstName"
          label="First Name"
          dense
        />
      </v-col>
      <!-- Subject Last Name -->
      <v-col>
        <v-text-field
          clearable
          v-model="filters.subjectLastName"
          label="Last Name"
          dense
        />
      </v-col>
    </v-row>

    <!-- Scan Information -->
    <v-row>
      <!-- Number -->
      <v-col class="pt-0">
        <v-text-field
          clearable
          v-model="filters.number"
          label="Scan Number"
          dense
          type="number"
        />
      </v-col>

      <!-- Description -->
      <v-col class="pt-0">
        <v-text-field
          clearable
          v-model="filters.description"
          label="Scan Description"
          dense
        />
      </v-col>
      <!-- Date -->
      <v-col class="pt-0" :cols="4">
        <v-row class="align-center">
          <!-- After Date -->
          <v-col>
            <v-menu v-model="afterDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable
                  readonly
                  label="Scanned After"
                  prepend-icon="event"
                  v-model="filters.afterDate"
                  v-on="on"
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.afterDate"
                @input="afterDateMenu = false"
              ></v-date-picker>
            </v-menu> </v-col
          >-
          <!-- Before Date -->
          <v-col>
            <v-menu v-model="beforeDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="filters.beforeDate"
                  label="Scanned Before"
                  readonly
                  clearable
                  v-on="on"
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.beforeDate"
                @input="beforeDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>

      <!-- Sequence Type -->
      <v-col class="pt-0">
        <v-autocomplete
          small-chips
          dense
          clearable
          multiple
          deletable-chips
          label="Sequence Type"
          v-model="filters.sequenceType"
          :items="sequenceTypeItems"
          :menu-props="menuProps"
        />
      </v-col>
    </v-row>
    <v-row>
      <!-- Study -->
      <v-col>
        <v-autocomplete
          v-model="filters.studies"
          label="Study"
          :items="studies"
          :loading="loadingStudies"
          item-text="title"
          item-value="id"
          multiple
          dense
          clearable
          small-chips
          deletable-chips
        />
      </v-col>

      <!-- Study Group -->
      <v-col>
        <v-autocomplete
          v-model="filters.groups"
          label="Study Group"
          small-chips
          clearable
          multiple
          deletable-chips
          item-value="id"
          :items="groupItems"
          :loading="loadingStudyGroups"
          :menu-props="menuProps"
          dense
        ></v-autocomplete>
      </v-col>

      <!-- Procedure -->
      <v-col>
        <v-autocomplete
          v-model="filters.procedures"
          label="Procedure"
          :items="procedures"
          :loading="loadingProcedures"
          item-text="title"
          item-value="id"
          multiple
          dense
          clearable
          small-chips
          deletable-chips
        />
      </v-col>

      <!-- Data Acquisition -->
      <v-col>
        <v-autocomplete
          v-model="filters.dataAcquisitions"
          label="Data Acquisition"
          :items="measurementDefinitions"
          :loading="loadingDataAcquisitions"
          item-text="title"
          item-value="id"
          multiple
          dense
          clearable
          small-chips
          deletable-chips
        />
      </v-col>

      <!-- Download Button -->
      <v-col :cols="1" class="px-0 text-right">
        <div>
          <v-dialog v-model="downloadScanDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
                small
                :disabled="!allowExport"
                :dark="allowExport"
              >
                Download
              </v-btn>
            </template>
            <download-scan-card
              :selectedScans="selectedScans"
              @close-scan-download-dialog="closeScanDownloadDialog"
            />
          </v-dialog>
        </div>
      </v-col>
      <!-- Export Button -->
      <v-col :cols="1">
        <div>
          <v-dialog v-model="exportScanDialog" max-width="500px">
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
            <export-scan-card
              :selectedScans="selectedScans"
              @close-scan-export-dialog="closeScanExportDialog"
              @scan-export-started="showExportSnackbar"
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
import { mapState, mapActions } from 'vuex'
import { SCANS } from '@/api/mri/endpoints.js'
import { SERIES } from '@/api/dicom/endpoints.js'
import { SEQUENCE_TYPE_ITEMS } from '@/components/utils.js'
import ExportScanCard from '@/components/mri/export-scan-card'
import DownloadScanCard from '@/components/mri/download-scan-card'

export default {
  name: 'ScanTableControls',
  components: { DownloadScanCard, ExportScanCard },
  props: {
    options: Object,
    subject: Object,
    session: Object,
    selectedScans: Array,
    studyFilter: { type: Array, default: () => [] },
    procedureFilter: { type: Array, default: () => [] },
    acquisitionFilter: { type: Array, default: () => [] },
    groupFilter: { type: Array, default: () => [] }
  },
  mounted() {
    if (this.subject) {
      this.$set(this.filters, 'subject', this.subject.id)
    }
    if (this.session) {
      this.$set(this.filters, 'session', this.session.id)
    }
    this.filters.studies = this.studyFilter
    this.filters.procedures = this.procedureFilter
    this.filters.dataAcquisitions = this.acquisitionFilter
    this.filters.groups = this.groupFilter
    // eslint-disable-next-line
    EventBus.$on('fetch-scans', this.update)
    this.update().then(() => {
      this.loadStudies()
      this.loadStudyGroups()
    })
  },
  data: () => ({
    filters: {
      number: '',
      description: '',
      afterDate: '',
      beforeDate: '',
      sequenceType: '',
      dicomId: '',
      session: '',
      subjectIdNumber: '',
      subjectFirstName: '',
      subjectLastName: '',
      studies: [],
      procedures: [],
      dataAcquisitions: [],
      groups: []
    },
    afterDateMenu: false,
    beforeDateMenu: false,
    sequenceTypeItems: SEQUENCE_TYPE_ITEMS,
    loadingStudies: false,
    loadingProcedures: false,
    loadingDataAcquisitions: false,
    loadingStudyGroups: false,
    menuProps: { offsetY: true, auto: true },
    exportScanDialog: false,
    exportSnackbar: false,
    exportSnackbarTimeout: 5000,
    exportSnackbarText: '',
    downloadScanDialog: false
  }),
  computed: {
    parsedOptions: function() {
      let options = Object.assign({}, this.options)
      options['sortBy'] = options['sortBy'].map(item => {
        if (item == 'date') {
          return 'time__date'
        } else if (item == 'time') {
          return 'time__time'
        } else if (item == 'subject.firstName') {
          return 'session__subject__first_name'
        } else if (item == 'subject.lastName') {
          return 'session__subject__last_name'
        } else if (item == 'subject.idNumber') {
          return 'session__subject__id_number'
        } else {
          return item
        }
      })
      return options
    },
    selectedIdsString: function() {
      return this.selectedScans.map(scan => scan.id).join(',')
    },
    selectedDicomIdsString: function() {
      return this.selectedScans.map(scan => scan.dicom).join(',')
    },
    niftiDownloadUrl: function() {
      return `${SCANS}/nifti_zip/${this.selectedIdsString}/`
    },
    dicomDownloadUrl: function() {
      return `${SERIES}/to_zip/${this.selectedDicomIdsString}/`
    },
    groupItems: function() {
      if (this.filters.studies.length == 1) {
        return this.groups.map(group => ({
          ...group,
          text: `${group.title}`
        }))
      } else {
        return this.groups.map(group => ({
          ...group,
          text: `${group.study.title} | ${group.title}`
        }))
      }
    },

    allowExport: function() {
      return Boolean(
        this.exportDestinations.length && this.selectedScans.length
      )
    },
    showPersonalInformationFilters: function() {
      return !this.subject && this.currentUser.isSuperuser
    },
    studyQuery: function() {
      return { filters: {}, options: {} }
    },
    procedureQuery: function() {
      return { filters: { studies: this.filters.studies }, options: {} }
    },
    dataAcquisitionQuery: function() {
      return {
        filters: {
          study: this.filters.studies,
          procedure: this.filters.procedures
        },
        options: {}
      }
    },
    studyGroupQuery: function() {
      return { filters: { study: this.filters.studies }, options: {} }
    },
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('auth', { currentUser: 'user' }),
    ...mapState('mri', ['scans']),
    ...mapState('research', [
      'groups',
      'studies',
      'procedures',
      'measurementDefinitions'
    ])
  },
  methods: {
    update() {
      this.$emit('fetch-scans-start')
      let query = { filters: this.filters, options: this.parsedOptions }
      return this.fetchScans(query).then(() => {
        this.$emit('fetch-scans-end')
      })
    },
    updateStudyGroups() {
      this.loadingStudyGroups = true
      this.fetchGroups(this.studyGroupQuery).then(() => {
        this.loadingStudyGroups = false
      })
    },
    closeScanExportDialog() {
      this.exportScanDialog = false
    },
    showExportSnackbar(nScans, nExportDestinations) {
      let exportDestinationsText =
        'destination' + (nExportDestinations > 1 ? 's' : '')
      let scanText = 'scan' + (nScans > 1 ? 's' : '')
      this.exportSnackbarText = `Data export successfully started! (${nScans} ${scanText}, ${nExportDestinations} ${exportDestinationsText})`
      this.exportSnackbar = true
    },
    closeScanDownloadDialog() {
      this.downloadScanDialog = false
    },
    loadStudies() {
      this.loadingStudies = true
      this.fetchStudies(this.studyQuery).then(() => {
        this.loadingStudies = false
      })
    },
    loadProcedures() {
      this.loadingProcedures = true
      this.fetchProcedures(this.procedureQuery).then(() => {
        this.loadingProcedures = false
      })
    },
    loadDataAcquisitions() {
      this.loadingDataAcquisitions = true
      this.fetchMeasurementDefinitions(this.dataAcquisitionQuery).then(() => {
        this.loadingDataAcquisitions = false
      })
    },
    loadStudyGroups() {
      this.loadingStudyGroups = true
      this.fetchGroups(this.studyGroupQuery).then(() => {
        this.loadingStudyGroups = false
      })
    },
    ...mapActions('mri', ['fetchScans']),
    ...mapActions('research', [
      'fetchGroups',
      'fetchStudies',
      'fetchProcedures',
      'fetchMeasurementDefinitions'
    ])
  },
  watch: {
    subject: function(selectedSubject) {
      this.$set(this.filters, 'subject', selectedSubject.id)
    },
    session: function(selectedSession) {
      this.$set(this.filters, 'session', selectedSession.id)
    },
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
    'filters.studies': function() {
      this.loadProcedures()
      this.loadStudyGroups()
      this.loadDataAcquisitions()
    },
    'filters.procedures': function() {
      this.loadDataAcquisitions()
    }
  }
}
</script>

<style scoped></style>
