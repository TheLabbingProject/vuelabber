<template>
  <div>
    <!-- Scan Upload -->
    <v-expansion-panel>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
            Upload
          </div>
        </template>
        <v-card>
          <v-card-text>
            <scan-upload :subject="subject" @file-upload-complete="update()" />
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- Group Association -->
    <v-expansion-panel>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
            Study Group Association
          </div>
        </template>
        <v-card>
          <v-card-text>
            <group-association :selectedScans="selected" />
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- Scan Table -->
    <scan-table-controls
      ref="tableController"
      :pagination="pagination"
      @fetch-scans-start="loading = true"
      @fetch-scans-end="loading = false"
    />
    <v-data-table
      v-model="selected"
      item-key="id"
      select-all
      :headers="headers"
      :loading="loading"
      :items="scans"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      :total-items="totalScanCount"
    >
      <template v-slot:items="props">
        <tr>
          <!-- Selection Checkbox -->
          <td>
            <v-checkbox
              v-model="props.selected"
              primary
              hide-details
            ></v-checkbox>
          </td>

          <!-- Scan Number -->
          <td class="text-left">
            {{ props.item.number }}
          </td>

          <!-- Description -->
          <td class="text-left">
            {{ props.item.description }}
          </td>

          <!-- Date -->
          <td class="text-left">
            {{ formatDate(props.item.time) }}
          </td>

          <!-- Time -->
          <td class="text-left">
            {{ formatTime(props.item.time) }}
          </td>

          <!-- Sequence Type -->
          <td class="text-left">
            <v-dialog
              v-model="sequenceTypeDialog[props.item.id]"
              v-if="props.item.sequenceType"
              lazy
              width="800px"
            >
              <template v-slot:activator="{ on }">
                <v-btn small class="info" v-on="on">
                  {{ sequenceTypeTitleFromUrl(props.item.sequenceType) }}
                </v-btn>
              </template>
              <protocol-information :scan="props.item" />
            </v-dialog>
          </td>

          <!-- Spatial Resolution -->
          <td class="text-left">
            {{ formatSpatialResolution(props.item.spatialResolution) }}
          </td>

          <!-- Study Groups -->
          <td>
            <div
              v-for="groupUrl in props.item.studyGroups"
              :key="groupUrl"
              class="text-xs-left"
            >
              <v-chip
                small
                close
                @input="disassociateFromGroup(props.item, groupUrl)"
              >
                {{ stringifyGroup(getGroupByUrl(groupUrl)) }}
              </v-chip>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import ProtocolInformation from '@/components/dicom/protocol-information.vue'
import GroupAssociation from '@/components/mri/group-association.vue'
import ScanUpload from '@/components/mri/scan-upload.vue'
import ScanTableControls from '@/components/mri/scan-table-controls.vue'

export default {
  name: 'ScanTable',
  components: {
    GroupAssociation,
    ProtocolInformation,
    ScanTableControls,
    ScanUpload
  },
  created() {
    this.fetchSequenceTypes()
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
        text: 'Spatial Resolution',
        value: 'spatialResolution',
        sortable: false
      },
      { text: 'Study Groups', value: 'studyGroups', sortable: false }
    ],
    selected: [],
    rowsPerPageItems: [
      10,
      25,
      50,
      { text: '$vuetify.dataIterator.rowsPerPageAll', value: 100000 }
    ],
    pagination: {
      rowsPerPage: 25,
      page: 1,
      ordering: 'number',
      descending: false
    },
    loading: false
  }),
  computed: {
    ...mapState('mri', ['scans', 'totalScanCount']),
    ...mapGetters('mri', ['getSequenceTypeByUrl']),
    ...mapGetters('research', { subject: 'getSelectedSubject' }),
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
    sequenceTypeTitleFromUrl(url) {
      let sequenceType = this.getSequenceTypeByUrl(url)
      return sequenceType ? sequenceType.title : null
    },
    update() {
      this.$refs.tableController.update()
    },
    ...mapActions('mri', ['fetchSequenceTypes', 'updateScan'])
  }
}
</script>

<style scoped></style>
