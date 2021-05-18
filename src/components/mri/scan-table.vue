<template>
  <div>
    <v-col v-if="currentUser.isStaff">
      <!-- <hr />
      <br /> -->
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
          <v-expansion-panel-header>
            <div class="text-center">Study Group Association</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <group-association :selectedScans="selected" />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- <br />
      <hr /> -->
    </v-col>

    <!-- Scan Preview -->
    <div :key="scanPreviewKey" :hidden="!showPreview">
      <div>
        {{ previewMessage }}
      </div>
      <div>
        <script :id="scanPreviewId" type="application/javascript"></script>
        <v-icon @click="showPreview = false">
          cancel
        </v-icon>
      </div>
    </div>

    <!-- Scan Table -->
    <v-data-table
      v-model="selected"
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
        <scan-table-controls
          ref="tableController"
          :options="options"
          :subject="subject"
          :session="session"
          :selected="selected"
          @fetch-scans-start="loading = true"
          @fetch-scans-end="loading = false"
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

      <!-- Date -->
      <template v-slot:item.date="{ item }">
        {{ item.time | formatDate }}
      </template>

      <!-- Time -->
      <template v-slot:item.time="{ item }">
        {{ item.time ? item.time.slice(11, 23) : '' }}
      </template>

      <!-- Sequence Type -->
      <template v-slot:item.sequenceType="{ item }">
        <!-- Existing -->
        <div v-if="item.sequenceType" class="py-1">
          <v-dialog v-model="sequenceTypeDialog[item.id]" width="800px">
            <template v-slot:activator="{ on }">
              <v-btn small class="info" v-on="on">{{
                item.sequenceType.title
              }}</v-btn>
            </template>
            <protocol-information :scan="item" />
          </v-dialog>
        </div>
        <!-- Create -->
        <div v-else class="py-1">
          <v-dialog v-model="sequenceTypeDialog[item.id]" width="400px">
            <template v-slot:activator="{ on }">
              <v-btn small class="warning" v-on="on">Create</v-btn>
            </template>
            <edit-sequence-type
              :fromScan="item"
              @close-dialog="sequenceTypeDialog[item.id] = false"
              @created-sequence-type="update"
            />
          </v-dialog>
        </div>
      </template>

      <!-- Spatial Resolution -->
      <template v-slot:item.spatialResolution="{ item }">
        {{ formatSpatialResolution(item.spatialResolution) }}
      </template>

      <!-- Study Groups -->
      <template v-slot:item.studyGroups="{ item }">
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
      <template v-slot:item.preview="{ item }">
        <v-icon @click="loadPreview(item.id)">
          search
        </v-icon>
      </template>

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
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { scanPreviewScript } from '@/api/mri/endpoints'
import EditSequenceType from '@/components/mri/edit-sequence-type.vue'
import GroupAssociation from '@/components/mri/group-association.vue'
import ProtocolInformation from '@/components/dicom/protocol-information.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import RunTable from '@/components/analysis/run-table.vue'
// import ScanUpload from '@/components/mri/scan-upload.vue'
import ScanTableControls from '@/components/mri/scan-table-controls.vue'
import VueScript2 from 'vue-script2'

export default {
  name: 'ScanTable',
  props: {
    subject: { type: Object, default: undefined },
    session: { type: Object, default: undefined }
  },
  components: {
    EditSequenceType,
    GroupAssociation,
    ProtocolInformation,
    RunTable,
    ScanTableControls,
    SubjectInfoCard
    // ScanUpload
  },
  mounted() {
    this.fetchSequenceTypes()
    let groupQuery = { filters: {}, options: {} }
    this.fetchGroups(groupQuery)
    if (this.subject != undefined) {
      this.removeHeader('subject')
    }
    if (this.session != undefined) {
      this.removeHeader('date')
    }
  },
  data: () => ({
    sequenceTypeDialog: {},
    headers: [
      { text: 'Subject', value: 'subject' },
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
      },
      { text: 'Preview', value: 'preview', sortable: false }
    ],
    selected: [],
    expanded: [],
    active: 0,
    options: {
      page: 1,
      sortBy: ['date', 'time'],
      sortDesc: [true, false],
      itemsPerPage: 25
    },
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false,
    scanPreviewKey: 0,
    editSubjectDialog: {},
    previewMessage: '',
    showPreview: false
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
      this.$refs.tableController.update()
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
    ...mapActions('mri', ['fetchSequenceTypes', 'updateScan']),
    ...mapActions('research', ['fetchGroups'])
  }
}
</script>

<style scoped></style>
