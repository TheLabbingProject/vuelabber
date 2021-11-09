<template>
  <v-container fluid>
    <v-col>
      <v-row>
        <v-col :cols="1">
          <v-text-field autofocus label="Primary Key" v-model="filters.pk" />
        </v-col>
        <v-col v-if="showPersonalInformationFilters">
          <v-text-field label="ID Number" v-model="filters.idNumber" />
        </v-col>
        <v-col v-if="showPersonalInformationFilters">
          <v-text-field label="First Name" v-model="filters.firstName" />
        </v-col>
        <v-col v-if="showPersonalInformationFilters">
          <v-text-field label="Last Name" v-model="filters.lastName" />
        </v-col>
        <v-col :cols="3">
          <v-row class="align-center">
            <v-col>
              <v-menu v-model="bornAfterMenu" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-text-field
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
          <v-select
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
      <v-row>
        <v-col>
          <v-autocomplete
            label="Study"
            clearable
            multiple
            v-model="filters.studies"
            :items="studies"
            item-value="id"
            item-text="title"
          />
        </v-col>

        <!-- Session time -->
        <v-col :cols="4">
          <v-row class="align-center">
            <v-col>
              <v-menu
                v-model="sessionTimeAfterMenu"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
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
        <v-spacer />
        <div class="py-1">
          <v-dialog v-model="exportSubjectDataDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
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
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { createSelectItems } from '@/components/utils'
import ExportSubjectDataCard from '@/components/research/export-subject-data-card'

export default {
  name: 'SubjectTableControls',
  props: { options: Object, selectedSubjects: Array },
  components: { ExportSubjectDataCard },
  created() {
    this.fetchStudies({ filters: {}, options: {} })
      .then(() => this.update())
      .then(() => this.fetchExportDestinations({ filters: {}, options: {} }))
  },
  data: () => ({
    bornAfterMenu: false,
    bornBeforeMenu: false,
    sessionTimeAfterMenu: false,
    sessionBeforeMenu: false,
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
      studies: '',
      mriSessionAfter: '',
      mriSessionBefore: ''
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
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('auth', ['user']),
    ...mapState('research', ['studies'])
  },
  methods: {
    update() {
      this.$emit('fetch-subjects-start')
      let options = Object.assign({}, this.options)
      options['sortBy'] = options['sortBy'].map(
        key => this.snakeCaseNames[key] || key
      )
      let query = { filters: this.filters, options: options }
      this.fetchSubjects(query).then(() => {
        this.$emit('fetch-subjects-end')
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
    ...mapActions('research', [
      'fetchStudies',
      'fetchSubjects',
      'exportSubjectData'
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
    }
  }
}
</script>

<style scoped></style>
