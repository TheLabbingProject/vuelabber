<template>
  <v-container fluid>
    <v-row class="px-4">
      <v-col v-if="showPersonalInformationFilters">
        <v-text-field
          v-model="filters.subjectIdNumber"
          label="Subject ID"
          autofocus
        />
      </v-col>
      <v-col v-if="showPersonalInformationFilters">
        <v-text-field v-model="filters.subjectFirstName" label="First Name" />
      </v-col>
      <v-col v-if="showPersonalInformationFilters">
        <v-text-field v-model="filters.subjectLastName" label="Last Name" />
      </v-col>
      <!-- Scan Date -->
      <v-col :cols="4">
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
      <v-col :cols="2">
        <v-select
          v-model="filters.studyIdIn"
          label="Associated Studies"
          :items="studies"
          item-text="title"
          item-value="id"
          multiple
          clearable
        />
      </v-col>
      <!-- Comments -->
      <v-col>
        <v-text-field v-model="filters.comments" label="Comments" />
      </v-col>

      <!-- Export Button -->
      <v-col :cols="1">
        <div class="pt-3 text-right">
          <v-dialog v-model="exportSessionDataDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
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
  props: ['subject', 'options', 'selectedSessions'],
  components: { ExportSessionCard },
  mounted() {
    if (this.subject) {
      this.$set(this.filters, 'subject', this.subject.id)
    }
    this.update()
    this.fetchStudies({ filters: {}, options: {} }).then(() =>
      this.fetchExportDestinations({
        filters: { user: this.currentUser.id },
        options: {}
      })
    )
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
      studyIdIn: []
    },
    afterDateMenu: false,
    beforeDateMenu: false,
    exportSessionDataDialog: false,
    exportSnackbar: false,
    exportSnackbarTimeout: 5000,
    exportSnackbarText: ''
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
    showPersonalInformationFilters: function() {
      return !this.subject && this.currentUser.isSuperuser
    },
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('research', ['studies']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    update() {
      this.$emit('fetch-sessions-start')
      let query = { filters: this.filters, options: this.parsedOptions }
      this.fetchSessions(query).then(() => {
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
    ...mapActions('mri', ['fetchSessions']),
    ...mapActions('research', ['fetchStudies']),
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
    }
  }
}
</script>

<style scoped></style>
