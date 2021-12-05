<template>
  <v-container fluid class="pa-0">
    <!-- Scan Preview -->
    <!-- <div :key="scanPreviewKey" :hidden="!showPreview">
      <div>
        {{ previewMessage }}
      </div>
      <div>
        <script :id="scanPreviewId" type="application/javascript"></script>
        <v-icon @click="showPreview = false">
          cancel
        </v-icon>
      </div>
    </div> -->

    <!-- Scan Table -->
    <v-data-table
      v-model="selectedScans"
      item-key="id"
      show-select
      multi-sort
      dense
      show-expand
      single-expand
      :expanded.sync="expanded"
      :footer-props="{
        'items-per-page-options': itemsPerPageOptions
      }"
      :headers="headers"
      :loading="loading"
      :items="scans"
      :options.sync="options"
      :server-items-length="scanCount"
    >
      <template v-slot:top>
        <v-container>
          <v-col>
            <v-row>
              <scan-table-controls
                ref="controls"
                :options="options"
                :subject="subject"
                :session="session"
                :selectedScans="selectedScans"
                :studyFilter="studyFilter"
                :procedureFilter="procedureFilter"
                :acquisitionFilter="acquisitionFilter"
                :groupFilter="groupFilter"
                @fetch-scans-start="loading = true"
                @fetch-scans-end="loading = false"
              />
            </v-row>
            <v-row v-if="currentUser.isStaff" class="py-1">
              <v-expansion-panels>
                <!-- Scan Upload -->
                <!-- <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="text-center">Upload</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <scan-upload
                  :subject="subject"
                  @file-upload-complete="update()"
                />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel> -->

                <!-- Study Group Association -->
                <v-expansion-panel>
                  <v-expansion-panel-header color="indigo lighten-5">
                    <div class="text-center">
                      Study Group Association
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-card>
                      <v-card-text>
                        <group-association :selectedScans="selectedScans" />
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
          </v-col>
        </v-container>
      </template>

      <!-- Date -->
      <template v-slot:[`item.date`]="{ item }">
        {{ item.time | formatDate }}
      </template>

      <!-- Time -->
      <template v-slot:[`item.time`]="{ item }">
        {{ item.time ? item.time.slice(11, 23) : '' }}
      </template>

      <!-- Sequence Type -->
      <template v-slot:[`item.sequenceType`]="{ item }">
        <v-chip
          class="ma-1"
          label
          :color="getSequenceTypeColor(item.sequenceType)"
          :text-color="getSequenceTypeTextColor(item.sequenceType)"
        >
          {{ getSequenceTypeText(item.sequenceType) }}
        </v-chip>
      </template>

      <!-- Spatial Resolution -->
      <template v-slot:[`item.spatialResolution`]="{ item }">
        {{ formatSpatialResolution(item.spatialResolution) }}
      </template>

      <!-- Study Groups -->
      <template v-slot:[`item.studyGroups`]="{ item }">
        <div v-for="groupId in item.studyGroups" :key="groupId" class="py-1">
          <v-chip
            small
            close
            @click:close="disassociateFromGroup(item, groupId)"
          >
            {{ stringifyGroup(getGroupById(groupId)) }}
          </v-chip>
        </div>
      </template>

      <!-- Preview -->
      <!-- <template v-slot:item.preview="{ item }">
        <v-icon @click="loadPreview(item.id)">
          search
        </v-icon>
      </template> -->

      <!-- Show scan runs when expanded -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="pa-0 ma-0">
          <v-tabs v-model="active">
            <v-tab>Runs</v-tab>
            <v-tab-item>
              <br />
              <run-table :scan="item" />
            </v-tab-item>
          </v-tabs>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import {
  SEQUENCE_TYPE_STYLING,
  SEQUENCE_TYPE_ITEMS
} from '@/components/utils.js'
import { scanPreviewScript } from '@/api/mri/endpoints'
import GroupAssociation from '@/components/mri/group-association.vue'
import RunTable from '@/components/analysis/run-table.vue'
// import ScanUpload from '@/components/mri/scan-upload.vue'
import ScanTableControls from '@/components/mri/scan-table-controls.vue'
import VueScript2 from 'vue-script2'

export default {
  name: 'ScanTable',
  props: {
    subject: { type: Object, default: undefined },
    session: { type: Object, default: undefined },
    studyFilter: { type: Array, default: () => [] },
    procedureFilter: { type: Array, default: () => [] },
    acquisitionFilter: { type: Array, default: () => [] },
    groupFilter: { type: Array, default: () => [] }
  },
  components: {
    GroupAssociation,
    RunTable,
    ScanTableControls
    // ScanUpload
  },
  mounted() {
    let groupQuery = { filters: {}, options: {} }
    this.fetchGroups(groupQuery)
    if (this.subject != undefined) {
      this.headers.splice(0, 3)
      this.options.sortBy = ['number']
      this.options.sortDesc = [false]
    }
    if (this.session != undefined) {
      this.headers = this.headers.filter(header => header.value != 'date')
      this.options.sortBy = ['number']
      this.options.sortDesc = [false]
    }
    if (this.subject == undefined && this.session == undefined) {
      this.options.sortBy = ['date', 'time']
      this.options.sortDesc = [true, true]
    }
  },
  data: () => ({
    headers: [
      { text: 'Subject ID', value: 'subject.idNumber', align: 'center' },
      { text: 'First Name', value: 'subject.firstName', align: 'center' },
      { text: 'Last Name', value: 'subject.lastName', align: 'center' },
      { text: 'Date', value: 'date' },
      { text: 'Time', value: 'time' },
      { text: 'Number', value: 'number' },
      { text: 'Description', value: 'description' },
      {
        text: 'Sequence Type',
        value: 'sequenceType',
        sortable: false,
        align: 'center'
      },
      {
        text: 'Spatial Resolution (mm)',
        value: 'spatialResolution',
        sortable: false,
        align: 'center'
      },
      {
        text: 'Study Groups',
        value: 'studyGroups',
        sortable: false,
        align: 'center'
      }
      // { text: 'Preview', value: 'preview', sortable: false }
    ],
    selectedScans: [],
    expanded: [],
    active: 0,
    options: {
      page: 1,
      sortBy: [],
      sortDesc: [],
      itemsPerPage: 25
    },
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false,
    scanPreviewKey: 0,
    editSubjectDialog: {},
    previewMessage: '',
    showPreview: false,
    sequenceStyle: SEQUENCE_TYPE_STYLING,
    sequenceItems: SEQUENCE_TYPE_ITEMS
  }),
  computed: {
    scanPreviewId: function() {
      return `scan-preview-${this.scanPreviewKey}`
    },
    ...mapState('auth', { currentUser: 'user' }),
    ...mapState('mri', ['scans', 'scanCount', 'scanPreviewLoader']),
    ...mapGetters('research', ['getGroupById'])
  },
  methods: {
    disassociateFromGroup(scan, groupId) {
      const index = scan.studyGroups.indexOf(groupId)
      if (index > -1) {
        scan.studyGroups.splice(index, 1)
      }
      let data = { scanId: scan.id, studyGroups: scan.studyGroups }
      this.updateScan(data)
    },
    formatSpatialResolution(floatArray) {
      return floatArray
        ? floatArray
            .map(item => parseFloat(item.toFixed(2)))
            .toString()
            .replace(/,/g, ' x ')
            .trim()
        : null
    },
    stringifyGroup(group) {
      return group ? `${group.study.title} | ${group.title}` : null
    },
    removeHeader(value) {
      this.headers = this.headers.filter(header => header.value != value)
      if (this.options.sortBy.includes(value)) {
        let index = this.options.sortBy.indexOf(value)
        this.options.sortBy.splice(index, 1)
        this.options.sortDesc.splice(index, 1)
      }
    },
    update() {
      this.$refs.controls.update()
    },
    loadPreview(scanId) {
      this.showPreview = true
      this.scanPreviewKey += 1
      this.previewMessage = 'Loading preview...'
      let src = scanPreviewScript(scanId, this.scanPreviewId)
      VueScript2.load(src).then(() => {
        this.previewMessage = ''
      })
    },
    getSequenceTypeText(sequenceTypeValue) {
      let sequence = this.sequenceItems.find(
        sequence => sequenceTypeValue == sequence.value
      )
      return sequence ? sequence.text : 'Unknown'
    },
    getSequenceTypeColor(sequenceTypeValue) {
      return sequenceTypeValue in this.sequenceStyle
        ? this.sequenceStyle[sequenceTypeValue].color
        : 'grey'
    },
    getSequenceTypeTextColor(sequenceTypeValue) {
      return sequenceTypeValue in this.sequenceStyle
        ? this.sequenceStyle[sequenceTypeValue].textColor
        : 'black'
    },
    ...mapActions('mri', ['updateScan']),
    ...mapActions('research', ['fetchGroups'])
  }
}
</script>

<style scoped></style>
