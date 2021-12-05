<template>
  <v-container fluid>
    <v-row v-if="showPersonalInformationFilters">
      <v-col>
        <v-text-field
          dense
          v-model="filters.subjectIdNumber"
          label="Subject ID"
          autofocus
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="filters.subjectFirstName"
          label="First Name"
          dense
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="filters.subjectLastName"
          label="Last Name"
          dense
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
          label="Group"
          :items="groupItems"
          :loading="loadingStudyGroups"
          item-value="id"
          multiple
          dense
          clearable
          small-chips
          deletable-chips
        />
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

      <!-- Scan Date -->
      <v-col :cols="3">
        <v-row class="align-center">
          <!-- After Date -->
          <v-col>
            <v-menu v-model="afterDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  dense
                  clearable
                  readonly
                  label="Scanned After"
                  prepend-icon="event"
                  v-model="filters.afterDate"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.afterDate"
                @input="afterDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- Before Date -->
          <v-col>
            <v-menu v-model="beforeDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  dense
                  v-model="filters.beforeDate"
                  label="Scanned Before"
                  readonly
                  clearable
                  v-on="on"
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

      <!-- Comments -->
      <v-col>
        <v-text-field v-model="filters.comments" label="Comments" dense />
      </v-col>

      <!-- Export Button -->
      <v-col :cols="1">
        <div class="text-right">
          <v-dialog v-model="exportSessionDataDialog" max-width="500px">
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
            <export-session-card
              :selectedSessions="selectedSessions"
              @close-session-export-dialog="closeSessionExportDialog"
              @session-export-started="showExportSnackbar"
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
import ExportSessionCard from '@/components/mri/export-session-card'

export default {
  name: 'SessionTableControls',
  props: {
    subject: Object,
    options: Object,
    selectedSessions: Array,
    studyFilter: { type: Array, default: () => [] },
    procedureFilter: { type: Array, default: () => [] },
    acquisitionFilter: { type: Array, default: () => [] },
    groupFilter: { type: Array, default: () => [] }
  },
  components: { ExportSessionCard },
  mounted() {
    if (this.subject) {
      this.$set(this.filters, 'subject', this.subject.id)
    }
    this.filters.studies = this.studyFilter
    this.filters.procedures = this.procedureFilter
    this.filters.dataAcquisitions = this.acquisitionFilter
    this.filters.groups = this.groupFilter
    this.update().then(() => {
      this.loadStudies()
      this.loadProcedures()
      this.fetchExportDestinations(this.exportDestinationQuery)
    })
  },
  data: () => ({
    filters: {
      subjectIdNumber: '',
      subjectFirstName: '',
      subjectlastName: '',
      afterDate: '',
      beforeDate: '',
      comments: '',
      subject: '',
      studies: [],
      procedures: [],
      dataAcquisitions: [],
      groups: []
    },
    afterDateMenu: false,
    beforeDateMenu: false,
    exportSessionDataDialog: false,
    exportSnackbar: false,
    exportSnackbarTimeout: 5000,
    exportSnackbarText: '',
    loadingStudies: false,
    loadingProcedures: false,
    loadingDataAcquisitions: false,
    loadingStudyGroups: false
  }),
  computed: {
    parsedOptions: function() {
      let options = Object.assign({}, this.options)
      options['sortBy'] = options['sortBy'].map(item => {
        if (item == 'date') {
          return 'time__date'
        } else if (item == 'time') {
          return 'time__time'
        } else if (item == 'subject.idNumber') {
          return 'subject__id_number'
        } else if (item == 'subject.firstName') {
          return 'subject__first_name'
        } else if (item == 'subject.lastName') {
          return 'subject__last_name'
        } else {
          return item
        }
      })
      return options
    },
    allowExport: function() {
      return Boolean(
        this.exportDestinations.length && this.selectedSessions.length
      )
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
    showPersonalInformationFilters: function() {
      return !this.subject && this.currentUser.isSuperuser
    },
    studyQuery: function() {
      return { filters: {}, options: {} }
    },
    procedureQuery: function() {
      return { filters: { studies: this.filters.studies }, options: {} }
    },
    exportDestinationQuery: function() {
      return {
        filters: { user: this.currentUser.id },
        options: {}
      }
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
    query: function() {
      return { filters: this.filters, options: this.parsedOptions }
    },
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('research', [
      'studies',
      'procedures',
      'measurementDefinitions',
      'groups'
    ]),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    update() {
      this.$emit('fetch-sessions-start')
      return this.fetchSessions(this.query).then(() => {
        this.$emit('fetch-sessions-end')
      })
    },
    closeSessionExportDialog() {
      this.exportSessionDataDialog = false
    },
    showExportSnackbar(nSessions, nExportDestinations) {
      let exportDestinationsText =
        'destination' + (nExportDestinations > 1 ? 's' : '')
      let sessionText = 'session' + (nSessions > 1 ? 's' : '')
      this.exportSnackbarText = `Data export successfully started! (${nSessions} ${sessionText}, ${nExportDestinations} ${exportDestinationsText})`
      this.exportSnackbar = true
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
    ...mapActions('mri', ['fetchSessions']),
    ...mapActions('research', [
      'fetchStudies',
      'fetchProcedures',
      'fetchMeasurementDefinitions',
      'fetchGroups'
    ]),
    ...mapActions('accounts', ['fetchExportDestinations'])
  },
  watch: {
    subject(selectedSubject) {
      if (selectedSubject) {
        this.$set(this.filters, 'subject', selectedSubject.id)
      }
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
