<template>
  <v-container fluid class="pt-1">
    <v-data-table
      v-model="selected"
      dense
      item-key="id"
      show-expand
      single-expand
      multi-sort
      show-select
      :expanded.sync="expanded"
      :headers="headers"
      :items="sessions"
      :loading="loading"
      :options.sync="options"
      :server-items-length="sessionCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <v-container fluid class="pt-2 px-0 pb-0">
          <v-col class="px-0">
            <v-row>
              <session-table-controls
                ref="controls"
                :subject="subject"
                :studyFilter="studyFilter"
                :options="options"
                :selectedSessions="selected"
                @fetch-sessions-start="loading = true"
                @fetch-sessions-end="loading = false"
              />
            </v-row>
            <v-row class="pb-3 mt-0">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header color="indigo lighten-5">
                    <div class="text-center">
                      Batch Acquisition Association
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-card>
                      <v-card-text>
                        <v-row>
                          <v-autocomplete
                            clearable
                            label="Data Acquisition Definition"
                            v-model="selectedMeasurementDefinition"
                            item-text="title"
                            item-value="id"
                            :items="measurementDefinitions"
                            :loading="loadingMeasurementDefinitionItems"
                            :search-input.sync="measurementDefinitionQuery"
                            @focus="updateMeasurementDefinitions"
                            @update:list-index="updateMeasurementDefinitions"
                          />
                          <v-btn
                            class="pl-5"
                            color="success"
                            @click="updateMeasurements"
                          >
                            Update
                          </v-btn>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
          </v-col>
        </v-container>
      </template>

      <!-- Subject ID button opening subject info dialog -->
      <!-- <template v-slot:[`item.subject`]="{ item }">
        <div class="py-1">
          <v-dialog v-model="editSubjectDialog[item.subject.id]" width="600px">
            <template v-slot:activator="{ on }">
              <v-btn small color="info" v-on="on">
                {{ item.subject.idNumber }}
              </v-btn>
            </template>
            <subject-info-card
              :subjectId="item.subject.id"
              @close-subject-dialog="editSubjectDialog[item.subject.id] = false"
            />
          </v-dialog>
        </div>
      </template> -->

      <!-- Date -->
      <template v-slot:[`item.date`]="{ item }">
        {{ item.time | formatDate }}
      </template>

      <!-- Time -->
      <template v-slot:[`item.time`]="{ item }">
        {{ item.time ? item.time.slice(11, 19) : '' }}
      </template>

      <!-- Measurement -->
      <template v-slot:[`item.measurement`]="{ item }">
        <v-edit-dialog
          :return-value.sync="item.measurement"
          large
          @save="saveMeasurement(item)"
        >
          <div>{{ item.measurement ? item.measurement.title : '' }}</div>
          <template v-slot:input>
            <v-autocomplete
              clearable
              label="Data Acquisition Definition"
              v-model="item.measurement"
              item-text="title"
              item-value="id"
              :items="measurementDefinitions"
              :loading="loadingMeasurementDefinitionItems"
              :search-input.sync="measurementDefinitionQuery"
              @focus="updateMeasurementDefinitions"
              @update:list-index="updateMeasurementDefinitions"
            />
          </template>
        </v-edit-dialog>
      </template>

      <!-- Comments -->
      <template v-slot:[`item.comments`]="{ item }">
        <v-edit-dialog
          :return-value.sync="item.comments"
          large
          @save="saveComments(item)"
        >
          <div>{{ item.comments }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.comments"
              label="Edit"
              single-line
              counter
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:[`item.irb`]="{ item }">
        <v-edit-dialog
          :return-value.sync="item.irb"
          large
          @save="saveIrb(item)"
        >
          <div>{{ getIrbDisplay(item.irb) }}</div>
          <template v-lazy v-slot:input v-if="item.irb">
            <v-row>
              <v-combobox
                v-model="item.irb.institution"
                label="Institution"
                :items="irbApprovalInstitutions"
                :loading="loadingIrbApprovalInstitutions"
                :search-input.sync="irbApprovalInstitution"
                autofocus
              ></v-combobox>
              <v-combobox
                v-model="item.irb.number"
                label="IRB Number"
                :items="irbApprovalNumbers"
                :loading="loadingIrbApprovalNumbers"
                :search-input.sync="irbApprovalNumber"
              ></v-combobox>
              <v-icon @click="removeIrb(item)">
                cancel
              </v-icon>
            </v-row>
          </template>
          <template v-lazy v-slot:input v-else>
            <v-row>
              <v-combobox
                v-model="newIrbApproval.institution"
                label="Institution"
                :items="irbApprovalInstitutions"
                :loading="loadingIrbApprovalInstitutions"
                :search-input.sync="irbApprovalInstitution"
                autofocus
              ></v-combobox>
              <v-combobox
                v-model="newIrbApproval.number"
                label="IRB Number"
                :items="irbApprovalNumbers"
                :loading="loadingIrbApprovalNumbers"
                :search-input.sync="irbApprovalNumber"
              ></v-combobox>
            </v-row>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Show scan table when expanded -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="subject-data pa-0 ma-0">
          <scan-table :subject="item.subject" :session="item" />
          <hr />
        </td>
      </template>

      <!-- Associated studies -->
      <template v-slot:[`item.studies`]="{ item }">
        <v-row no-gutters>
          <span
            v-for="study in getAssociatedStudies(item)"
            :key="`${item.id}-${study.id}`"
            class="pa-1"
          >
            <v-chip class="pa-1" small>
              <div class="pa-1">
                {{ study.title }}
              </div>
            </v-chip>
          </span>
        </v-row>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import ScanTable from '@/components/mri/scan-table.vue'
import SessionTableControls from '@/components/mri/session-table-controls.vue'
// import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapActions, mapState } from 'vuex'
import BASE_URL from '@/api/base_url.js'

export default {
  name: 'SessionTable',
  props: { subject: Object, studyFilter: Array },
  components: {
    ScanTable,
    SessionTableControls
    // SubjectInfoCard
  },
  mounted() {
    if (this.currentUser.isSuperuser && this.subject == undefined) {
      this.headers = [...this.personalInformation, ...this.headers]
    }
  },
  data: () => ({
    headers: [
      { text: 'Date', value: 'date', width: 100 },
      { text: 'Time', value: 'time', width: 100 },
      { text: 'Data Acquisition', value: 'measurement' },
      { text: 'IRB', value: 'irb' },
      { text: 'Comments', value: 'comments' },
      { text: 'Scans', value: 'nScans', width: 90 },
      {
        text: 'Studies',
        value: 'studies',
        align: 'center',
        sortable: false,
        width: 200
      },
      {
        text: '',
        value: 'export',
        align: 'center',
        sortable: false,
        width: 200
      }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['date', 'time'],
      sortDesc: [true, true]
    },
    personalInformation: [
      { text: 'Subject ID', value: 'subject.idNumber', align: 'center' },
      { text: 'First Name', value: 'subject.firstName', align: 'center' },
      { text: 'Last Name', value: 'subject.lastName', align: 'center' }
    ],
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false,
    expanded: [],
    editSubjectDialog: {},
    loadingMeasurementDefinitionItems: false,
    measurementDefinitionQuery: '',
    selectedMeasurementDefinition: null,
    selected: [],
    loadingIrbApprovalNumbers: false,
    loadingIrbApprovalInstitutions: false,
    irbApprovalInstitution: '',
    irbApprovalNumber: '',
    newIrbApproval: { institution: '', number: '' },
    gettingDicomZip: false
  }),
  computed: {
    irbApprovalInstitutions: function() {
      return this.irbApprovals.map(irb => irb.institution)
    },
    irbApprovalNumbers: function() {
      return this.irbApprovals.map(irb => irb.number)
    },
    ...mapState('mri', ['irbApprovals', 'sessions', 'sessionCount']),
    ...mapState('research', ['measurementDefinitions']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    saveComments(session) {
      let data = { sessionId: session.id, comments: session.comments }
      this.patchSession(data)
    },
    saveMeasurement(session) {
      let data = { sessionId: session.id, measurementId: session.measurement }
      this.patchSession(data).then(() => this.$refs.controls.update())
    },
    updateMeasurements() {
      this.selected.forEach(session => {
        let data = {
          sessionId: session.id,
          measurementId: this.selectedMeasurementDefinition
        }
        this.patchSession(data).then(() => this.$refs.controls.update())
      })
    },
    updateMeasurementDefinitions() {
      let query = {
        filters: {
          title: this.measurementDefinitionQuery,
          modelName: 'session',
          appLabel: 'django_mri'
        },
        options: {}
      }
      this.loadingMeasurementDefinitionItems = true
      this.fetchMeasurementDefinitions(query).then(
        () => (this.loadingMeasurementDefinitionItems = false)
      )
    },
    getIrbDisplay(irb) {
      return irb ? `${irb.institution || ''}/${irb.number || ''}` : ''
    },
    filterIrbApprovals() {
      this.loadingIrbApprovalInstitutions = true
      this.loadingIrbApprovalNumbers = true
      let filters = {
        number: this.irbApprovalNumber,
        institution: this.irbApprovalInstitution
      }
      this.fetchIrbApprovals({
        filters,
        options: {
          page: 1,
          itemsPerPage: 50,
          sortBy: undefined,
          sortDesc: undefined
        }
      }).then(() => {
        this.loadingIrbApprovalInstitutions = false
        this.loadingIrbApprovalNumbers = false
      })
    },
    saveIrb(session) {
      let irb = session.irb || this.newIrbApproval
      let patch = {
        sessionId: session.id,
        irb
      }
      this.patchSession(patch).then(() => {
        this.$refs.controls.update()
      })
    },
    removeIrb(session) {
      let patch = {
        sessionId: session.id,
        irbId: null
      }
      this.patchSession(patch).then(() => {
        this.$refs.controls.update()
      })
    },
    getDicomZip(session) {
      return `${BASE_URL}/${session.dicomZip.substring(5)}`
    },
    getNiftiZip(session) {
      return `${BASE_URL}/${session.niftiZip.substring(5)}`
    },
    closeExportDialog() {
      this.exportDialog = false
    },
    getAssociatedStudies(session) {
      let groupStudies = session.studyGroups.map(group => group.study)
      let measurementStudies = session.measurement
        ? session.measurement.associatedStudies
        : []
      return groupStudies
        .concat(measurementStudies)
        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    },
    ...mapActions('mri', ['fetchIrbApprovals', 'patchSession']),
    ...mapActions('research', ['fetchMeasurementDefinitions'])
  },

  watch: {
    irbApprovalNumber: function() {
      this.filterIrbApprovals()
    },
    irbApprovalInstitution: function() {
      this.filterIrbApprovals()
    },
    exportDialog(val) {
      val || this.closeExportDialog()
    }
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.subject-data {
  background-color: #dfe9fd;
}
</style>
