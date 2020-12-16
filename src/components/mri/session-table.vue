<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div class="text-center">Event Association</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card>
            <v-card-text>
              <v-row>
                <v-autocomplete
                  clearable
                  label="Data Acquisition Definition"
                  v-model="selectedMeasurementDefinition"
                  :items="measurementDefinitionItems"
                  :loading="loadingMeasurementDefinitionItems"
                  :search-input.sync="existingMeasurementDefinitionQuery"
                  @focus="updateMeasurementDefinitionItems"
                  @update:list-index="updateMeasurementDefinitionItems"
                />
                <v-btn class="pl-5" color="success" @click="updateMeasurements"
                  >Update</v-btn
                >
              </v-row>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
        <session-table-controls
          ref="controls"
          :bus="bus"
          :subject="subject"
          :options="options"
          @fetch-sessions-start="loading = true"
          @fetch-sessions-end="loading = false"
        />
      </template>

      <!-- Subject ID button opening subject info dialog -->
      <template v-slot:item.subject="{ item }">
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
      </template>

      <!-- Date and time -->
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.time) }}
      </template>
      <template v-slot:item.time="{ item }">
        {{ formatTime(item.time) }}
      </template>

      <!-- Comments -->
      <template v-slot:item.comments="{ item }">
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

      <template v-slot:item.irb="{ item }">
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
    </v-data-table>
  </div>
</template>

<script>
import ScanTable from '@/components/mri/scan-table.vue'
import SessionTableControls from '@/components/mri/session-table-controls.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SessionTable',
  props: ['subject', 'bus'],
  components: {
    ScanTable,
    SessionTableControls,
    SubjectInfoCard
  },
  mounted() {
    if (this.subject) {
      this.headers.splice(1, 1)
    }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left', width: 1 },
      { text: 'Subject', value: 'subject', align: 'center' },
      { text: 'Date', value: 'date' },
      { text: 'Time', value: 'time' },
      { text: 'Measurement', value: 'measurement.title' },
      { text: 'IRB', value: 'irb' },
      { text: 'Comments', value: 'comments' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['date', 'time'],
      sortDesc: [true, true]
    },
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false,
    expanded: [],
    editSubjectDialog: {},
    loadingMeasurementDefinitionItems: false,
    existingMeasurementDefinitionQuery: null,
    selectedMeasurementDefinition: null,
    selected: [],
    loadingIrbApprovalNumbers: false,
    loadingIrbApprovalInstitutions: false,
    irbApprovalInstitution: '',
    irbApprovalNumber: '',
    newIrbApproval: { institution: '', number: '' }
  }),
  computed: {
    irbApprovalInstitutions: function() {
      return this.irbApprovals.map(irb => irb.institution)
    },
    irbApprovalNumbers: function() {
      return this.irbApprovals.map(irb => irb.number)
    },
    ...mapState('mri', ['irbApprovals', 'sessions', 'sessionCount']),
    ...mapState('research', ['measurementDefinitionItems']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    formatDate(sessionTime) {
      if (!sessionTime) return null
      let [year, month, day] = sessionTime.slice(0, 10).split('-')
      return `${day}/${month}/${year}`
    },
    formatTime(sessionTime) {
      if (!sessionTime) return null
      let time = sessionTime.slice(11, 23)
      return time
    },
    saveComments(session) {
      let data = { sessionId: session.id, comments: session.comments }
      this.patchSession(data)
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
    updateMeasurementDefinitionItems() {
      let value =
        this.existingMeasurementDefinitionQuery == null
          ? ''
          : this.existingMeasurementDefinitionQuery
      let query = {
        filters: { title: value },
        options: {}
      }
      this.loadingMeasurementDefinitionItems = true
      this.fetchMeasurementDefinitionItems(query).then(
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
      this.patchSession(patch)
    },
    ...mapActions('mri', ['fetchIrbApprovals', 'patchSession']),
    ...mapActions('research', ['fetchMeasurementDefinitionItems'])
  },
  watch: {
    irbApprovalNumber: function() {
      this.filterIrbApprovals()
    },
    irbApprovalInstitution: function() {
      this.filterIrbApprovals()
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
