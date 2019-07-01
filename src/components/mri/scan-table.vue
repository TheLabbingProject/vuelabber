<template>
  <div>
    <scan-upload :subject="subject" />
    <v-data-table
      item-key="id"
      :headers="headers"
      :items="scans"
      :rows-per-page-items="[
        10,
        25,
        50,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ]"
    >
      <template v-slot:items="props">
        <tr>
          <td>
            {{ props.item.number }}
          </td>
          <td>
            {{ props.item.description }}
          </td>
          <td>
            {{ props.item.time }}
          </td>
          <td>
            <v-dialog
              v-model="sequenceTypeDialog[props.item.id]"
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
          <td>
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
    this.fetchSubjectScans(this.subject)
  },
  data: () => ({
    sequenceTypeDialog: {},
    headers: [
      { text: 'Number', value: 'number' },
      { text: 'Description', value: 'description' },
      { text: 'Time', value: 'time' },
      { text: 'Sequence Type', value: 'sequenceType' },
      { text: 'Spatial Resolution', value: 'spatialResolution' }
    ]
  }),
  computed: {
    ...mapState('mri', ['scans']),
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
    ...mapActions('mri', ['fetchSubjectScans', 'fetchSequenceTypes'])
  },
  watch: {
    subject: function(selectedSubject) {
      this.fetchSubjectScans(selectedSubject)
    }
  }
}
</script>

<style lang="scss" scoped></style>
