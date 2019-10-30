<template>
  <div>
    <v-col v-if="currentUser.isStaff">
      <hr />
      <br />
      <v-expansion-panels>
        <!-- Scan Upload -->
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="text-center">
              Upload
            </div>
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
        </v-expansion-panel>

        <!-- Study Group Association -->
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="text-center">
              Study Group Association
            </div>
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

      <br />
      <hr />
    </v-col>

    <!-- Scan Table -->
    <v-data-table
      v-model="selected"
      item-key="id"
      show-select
      :headers="headers"
      :loading="loading"
      :items="scans"
      :items-per-page-options="itemsPerPageOptions"
      :options.sync="options"
      :server-items-length="totalScanCount"
    >
      <template v-slot:top>
        <scan-table-controls
          ref="tableController"
          :options="options"
          :subject="subject"
          @fetch-scans-start="loading = true"
          @fetch-scans-end="loading = false"
        />
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.time) }}
      </template>

      <template v-slot:item.time="{ item }">
        {{ formatTime(item.time) }}
      </template>

      <template v-slot:item.sequenceType="{ item }">
        <div v-if="item.sequenceType" class="py-1">
          <v-dialog v-model="sequenceTypeDialog[item.id]" width="800px">
            <template v-slot:activator="{ on }">
              <v-btn small class="info" v-on="on">
                {{ item.sequenceType.title }}
              </v-btn>
            </template>
            <protocol-information :scan="item" />
          </v-dialog>
        </div>
        <div v-else class="py-1">
          <v-dialog v-model="sequenceTypeDialog[item.id]" width="400px">
            <template v-slot:activator="{ on }">
              <v-btn small class="warning" v-on="on">
                Create
              </v-btn>
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
        <div v-for="groupUrl in item.studyGroups" :key="groupUrl" class="py-1">
          <v-chip small close @input="disassociateFromGroup(item, groupUrl)">
            {{ stringifyGroup(getGroupByUrl(groupUrl)) }}
          </v-chip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import EditSequenceType from '@/components/mri/edit-sequence-type.vue'
import GroupAssociation from '@/components/mri/group-association.vue'
import ProtocolInformation from '@/components/dicom/protocol-information.vue'
import ScanUpload from '@/components/mri/scan-upload.vue'
import ScanTableControls from '@/components/mri/scan-table-controls.vue'

export default {
  name: 'ScanTable',
  props: {
    subject: Object
  },
  components: {
    EditSequenceType,
    GroupAssociation,
    ProtocolInformation,
    ScanTableControls,
    ScanUpload
  },
  created() {
    this.fetchSequenceTypes()
    this.fetchGroups()
  },
  data: () => ({
    sequenceTypeDialog: {},
    headers: [
      { text: 'Number', value: 'number' },
      { text: 'Description', value: 'description' },
      { text: 'Date', value: 'date', sortable: false },
      { text: 'Time', value: 'time', sortable: false },
      { text: 'Sequence Type', value: 'sequenceType', sortable: false },
      {
        text: 'Spatial Resolution (mm)',
        value: 'spatialResolution',
        sortable: false
      },
      { text: 'Study Groups', value: 'studyGroups', sortable: false }
    ],
    selected: [],
    options: {
      page: 1,
      sortBy: ['number'],
      descending: false,
      itemsPerPage: 25
    },
    itemsPerPageOptions: [
      10,
      25,
      50,
      { text: '$vuetify.dataIterator.itemsPerPageAll', value: 100000 }
    ],
    loading: false
  }),
  computed: {
    ...mapState('auth', { currentUser: 'user' }),
    ...mapState('mri', ['scans', 'totalScanCount']),
    ...mapGetters('mri', ['getSequenceTypeByUrl']),
    // ...mapGetters('research', { subject: 'getSelectedSubject' }),
    ...mapGetters('research', ['getGroupByUrl'])
  },
  methods: {
    disassociateFromGroup(scan, groupUrl) {
      scan.studyGroups = scan.studyGroups.filter(url => url != groupUrl)
      this.updateScan(scan)
    },
    formatSpatialResolution(floatArray) {
      return floatArray
        .map(item => parseFloat(item.toFixed(2)))
        .toString()
        .replace(/,/g, ' x ')
        .trim()
    },
    formatDate(scanTime) {
      if (!scanTime) return null
      let [year, month, day] = scanTime.slice(0, 10).split('-')
      return `${day}/${month}/${year}`
    },
    formatTime(scanTime) {
      if (!scanTime) return null
      return scanTime.slice(11, 23)
    },
    stringifyGroup(group) {
      return group ? `${group.study.title} | ${group.title}` : null
    },
    update() {
      this.$refs.tableController.update()
    },
    ...mapActions('mri', ['fetchSequenceTypes', 'updateScan']),
    ...mapActions('research', ['fetchGroups'])
  }
}
</script>

<style scoped>
.check {
  color: rgb(207, 255, 195);
}
</style>
