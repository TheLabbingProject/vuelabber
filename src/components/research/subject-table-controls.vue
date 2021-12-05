<template>
  <v-container fluid class="pa-0">
    <v-col class="pb-0">
      <v-row v-if="infoSummaryLoaded" :key="plotScriptLoaded">
        <span v-html="plots.subject.summary.tag"></span>
        <script2>
          {{ plots.subject.summary.js }}
        </script2>
      </v-row>
      <v-row>
        <v-col :cols="1">
          <v-text-field
            autofocus
            label="Primary Key"
            v-model="filters.pk"
            dense
          />
        </v-col>
        <v-col v-if="showPersonalInformationFilters">
          <v-text-field label="Subject ID" v-model="filters.idNumber" dense />
        </v-col>
        <v-col v-if="showPersonalInformationFilters">
          <v-text-field label="First Name" v-model="filters.firstName" dense />
        </v-col>
        <v-col v-if="showPersonalInformationFilters">
          <v-text-field label="Last Name" v-model="filters.lastName" dense />
        </v-col>
        <v-col :cols="3">
          <v-row class="align-center">
            <v-col>
              <v-menu v-model="bornAfterMenu" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    clearable
                    readonly
                    label="Born After"
                    prepend-icon="event"
                    v-model="filters.bornAfter"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.bornAfter"
                  @input="bornAfterMenu = false"
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu v-model="bornBeforeMenu" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    clearable
                    readonly
                    label="Born Before"
                    v-model="filters.bornBefore"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.bornBefore"
                  @input="bornBeforeMenu = false"
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>

        <v-col :cols="1">
          <v-autocomplete
            dense
            clearable
            label="Sex"
            v-model="filters.sex"
            :items="sexItems"
          />
        </v-col>
        <!-- <v-col :cols="1">
      <v-select
        clearable
        label="Gender"
        v-model="filters.gender"
        :items="genderItems"
      />
    </v-col> -->
        <!-- <v-col :cols="2">
      <v-select
        clearable
        label="Dominant Hand"
        v-model="filters.dominantHand"
        :items="dominantHandItems"
      />
    </v-col> -->
      </v-row>
      <v-row class="my-0">
        <!-- Study -->
        <v-col>
          <v-autocomplete
            label="Study"
            dense
            clearable
            multiple
            v-model="filters.studies"
            :items="studies"
            :loading="loadingStudies"
            item-value="id"
            item-text="title"
            deletable-chips
            small-chips
          />
        </v-col>

        <!-- Study Group -->
        <v-col>
          <v-autocomplete
            label="Group"
            dense
            clearable
            multiple
            v-model="filters.groups"
            :items="groupItems"
            :loading="loadingStudyGroups"
            item-value="id"
            deletable-chips
            small-chips
            @update:search-input="loadStudyGroups"
          />
        </v-col>

        <!-- Procedure -->
        <v-col>
          <v-autocomplete
            label="Experimental Procedure"
            dense
            clearable
            multiple
            v-model="filters.procedures"
            :items="procedures"
            :loading="loadingProcedures"
            item-value="id"
            item-text="title"
            deletable-chips
            small-chips
            @update:search-input="loadProcedures"
          />
        </v-col>

        <!-- Data Acquisition -->
        <v-col>
          <v-autocomplete
            label="Data Acquisition"
            dense
            clearable
            multiple
            v-model="filters.dataAcquisition"
            :items="measurementDefinitions"
            :loading="loadingDataAcuisitions"
            item-value="id"
            item-text="title"
            deletable-chips
            small-chips
            @update:search-input="loadDataAcuisitions"
          />
        </v-col>

        <!-- Session time -->
        <v-col :cols="3">
          <v-row class="align-center">
            <v-col>
              <v-menu
                v-model="sessionTimeAfterMenu"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    clearable
                    readonly
                    label="Scanned After"
                    prepend-icon="event"
                    v-model="filters.mriSessionAfter"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.mriSessionAfter"
                  @input="sessionTimeAfterMenu = false"
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu
                v-model="sessionBeforeMenu"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    clearable
                    dense
                    readonly
                    label="Scanned Before"
                    v-model="filters.mriSessionBefore"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.mriSessionBefore"
                  @input="sessionBeforeMenu = false"
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
        <v-col :cols="1">
          <v-btn small class="info" @click="toCsv">CSV</v-btn>
        </v-col>
        <v-col :cols="1">
          <v-dialog v-model="exportSubjectDataDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                color="primary"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                :disabled="!allowExport"
                :dark="allowExport"
              >
                Export
              </v-btn>
            </template>
            <export-subject-data-card
              :selectedSubjects="selectedSubjects"
              @close-subject-export-dialog="closeSubjectExportDialog"
              @subject-export-started="showExportSnackbar"
            />
          </v-dialog>
        </v-col>

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
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import session from '@/api/session'
import { getSubjectQueryString } from '@/api/research/query'
import { SUBJECTS_CSV } from '@/api/research/endpoints'

import { mapActions, mapState } from 'vuex'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { createSelectItems } from '@/components/utils'
import ExportSubjectDataCard from '@/components/research/export-subject-data-card'
var FileSaver = require('file-saver')

export default {
  name: 'SubjectTableControls',
  props: { options: Object, selectedSubjects: Array },
  components: { ExportSubjectDataCard },
  mounted() {
    this.update().then(() => {
      this.loadStudies()
      this.loadStudyGroups()
      this.fetchExportDestinations({ filters: {}, options: {} })
    })
  },
  data: () => ({
    plotScriptLoaded: 0,
    bornAfterMenu: false,
    bornBeforeMenu: false,
    sessionTimeAfterMenu: false,
    sessionBeforeMenu: false,
    loadingStudies: false,
    loadingProcedures: false,
    loadingDataAcuisitions: false,
    loadingStudyGroups: false,
    filters: {
      pk: '',
      idNumber: '',
      firstName: '',
      lastName: '',
      bornAfter: '',
      bornBefore: '',
      sex: '',
      gender: '',
      dominantHand: '',
      studies: [],
      mriSessionAfter: '',
      mriSessionBefore: '',
      groups: [],
      measurementDefinitions: [],
      procedures: []
    },
    sexItems: createSelectItems(sexOptions),
    genderItems: createSelectItems(genderOptions),
    dominantHandItems: createSelectItems(dominantHandOptions),
    snakeCaseNames: {
      idNumber: 'id_number',
      firstName: 'first_name',
      lastName: 'last_name',
      dateOfBirth: 'date_of_birth'
    },
    exportSubjectDataDialog: false,
    exportSnackbar: false,
    exportSnackbarTimeout: 5000,
    exportSnackbarText: ''
  }),
  computed: {
    allowExport: function() {
      return Boolean(
        this.exportDestinations.length && this.selectedSubjects.length
      )
    },
    showPersonalInformationFilters: function() {
      // return this.user.isStaff
      return true
    },
    computedOptions: function() {
      let options = Object.assign({}, this.options)
      options['sortBy'] = options['sortBy'].map(
        key => this.snakeCaseNames[key] || key
      )
      return options
    },
    query: function() {
      return { filters: this.filters, options: this.computedOptions }
    },
    infoSummaryLoaded: function() {
      return Boolean(
        this.plots.subject.summary.js && this.plots.subject.summary.tag
      )
    },
    procedureFilter: function() {
      return { studies: this.filters.studies }
    },
    dataAcquisitionFilter: function() {
      return { procedure: this.filters.procedures, study: this.filters.studies }
    },
    studyGroupFilter: function() {
      return { study: this.filters.studies }
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
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('auth', ['user']),
    ...mapState('research', [
      'studies',
      'plots',
      'groups',
      'measurementDefinitions',
      'procedures'
    ])
  },
  methods: {
    toCsv: function() {
      let queryString = getSubjectQueryString(this.query)
      let URL = `${SUBJECTS_CSV}/${queryString}`
      return session
        .get(URL, { responseType: 'blob' })
        .then(response => {
          // Log somewhat to show that the browser actually exposes the custom HTTP header
          const fileNameHeader = 'x-suggested-filename'
          const suggestedFileName = response.headers[fileNameHeader]
          const effectiveFileName =
            suggestedFileName === undefined ? 'subjects.csv' : suggestedFileName
          console.log(
            `Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`
          )

          // Let the user save the file.
          FileSaver.saveAs(response.data, effectiveFileName)
        })
        .catch(response => {
          console.error(
            'Could not Download the CSV report from the backend.',
            response
          )
        })
    },
    update() {
      this.$emit('fetch-subjects-start')
      return this.fetchSubjects(this.query).then(() => {
        this.$emit('fetch-subjects-end')
        this.fetchSubjectsInfoPlot(this.query).then(() => {
          // this.$nextTick(() => {
          //   this.plotScriptLoaded++
          // })
        })
      })
    },
    showExportSnackbar(nSubjects, nExportDestinations) {
      let exportDestinationsText =
        'destination' + (nExportDestinations > 1 ? 's' : '')
      let subjectsText = 'subject' + (nSubjects > 1 ? 's' : '')
      this.exportSnackbarText = `Data export successfully started! (${nSubjects} ${subjectsText}, ${nExportDestinations} ${exportDestinationsText})`
      this.exportSnackbar = true
    },
    closeSubjectExportDialog() {
      this.exportSubjectDataDialog = false
    },
    loadStudies() {
      this.loadingStudies = true
      this.fetchStudies({ filters: {}, options: {} }).then(
        (this.loadingStudies = false)
      )
    },
    loadProcedures() {
      this.loadingProcedures = true
      let query = { filters: this.procedureFilter, options: {} }
      this.fetchProcedures(query).then(() => {
        this.loadingProcedures = false
        // if (this.procedures.length == 1) {
        //   this.filters.procedures.push(this.procedures[0].id)
        // }
        this.loadDataAcuisitions()
      })
    },
    loadDataAcuisitions() {
      this.loadingDataAcuisitions = true
      let query = { filters: this.dataAcquisitionFilter, options: {} }
      this.fetchMeasurementDefinitions(query).then(() => {
        this.loadingDataAcuisitions = false
      })
    },
    loadStudyGroups() {
      this.loadingStudyGroups = true
      let query = { filters: this.studyGroupFilter, options: {} }
      this.fetchGroups(query).then(() => {
        this.loadingStudyGroups = false
      })
    },
    ...mapActions('research', [
      'fetchStudies',
      'fetchSubjects',
      'exportSubjectData',
      'fetchSubjectsInfoPlot',
      'fetchGroups',
      'fetchMeasurementDefinitions',
      'fetchProcedures'
    ]),
    ...mapActions('accounts', ['fetchExportDestinations'])
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
    'filters.studies': function() {
      this.loadProcedures()
      this.loadDataAcuisitions()
      this.loadStudyGroups()
    },
    'filters.procedures': function() {
      this.loadDataAcuisitions()
    },
    'plots.subject.summary': {
      handler() {
        this.plotScriptLoaded++
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
