<template>
  <div>
    <!-- Scan Upload -->
    <v-expansion-panel>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
            Upload new data
          </div>
        </template>
        <v-card>
          <v-card-text>
            <scan-upload
              :subject="subject"
              @file-upload-complete="updateScanTable()"
            />
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- Scan Table -->
    <v-data-table
      item-key="id"
      :headers="headers"
      :loading="loading"
      :items="scans"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      :total-items="totalScansCount"
    >
      <template v-slot:items="props">
        <tr>
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
                  {{ getSequenceTypeByUrl(props.item.sequenceType).title }}
                </v-btn>
              </template>
              <protocol-information :scan="props.item" />
            </v-dialog>
          </td>

          <!-- Spatial Resolution -->
          <td class="text-left">
            {{ formatSpatialResolution(props.item.spatialResolution) }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import ProtocolInformation from '@/components/dicom/protocol-information.vue'
import ScanUpload from '@/components/mri/scan-upload.vue'

export default {
  name: 'ScanTable',
  components: {
    ProtocolInformation,
    ScanUpload
  },
  created() {
    this.fetchSequenceTypes()
    this.fetchSubjectScans({
      subject: this.subject,
      pagination: this.pagination
    })
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
      }
    ],
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
    ...mapState('mri', ['scans', 'totalScansCount']),
    ...mapGetters('mri', ['getSequenceTypeByUrl']),
    ...mapGetters('research', { subject: 'getSelectedSubject' })
  },
  methods: {
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
    updateScanTable() {
      this.loading = true
      this.fetchSubjectScans({
        subject: this.subject,
        pagination: this.pagination
      })
      this.loading = false
    },
    ...mapActions('mri', ['fetchSubjectScans', 'fetchSequenceTypes'])
  },
  watch: {
    subject: function(selectedSubject) {
      this.loading = true
      this.fetchSubjectScans({
        subject: selectedSubject,
        pagination: this.pagination
      })
      this.loading = false
    },
    pagination: {
      handler() {
        this.loading = true
        this.fetchSubjectScans({
          subject: this.subject,
          pagination: this.pagination
        })
        this.loading = false
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
