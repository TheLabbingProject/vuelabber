<template>
  <v-container fluid>
    <!-- <group-association :selectedSeries="selectedSeries" /> -->
    <v-layout row wrap>
      <v-flex>
        <v-data-table
          v-model="selectedSeries"
          :headers="headers"
          :items="seriesList"
          item-key="id"
          hide-actions
          select-all
        >
          <template v-slot:items="props">
            <tr>
              <td>
                <v-checkbox
                  v-model="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-xs-left">{{ props.item.number }}</td>
              <td class="text-xs-left">{{ props.item.description }}</td>
              <td class="text-xs-left">
                {{ props.item.time.slice(0, 8) }}
              </td>
              <td class="text-xs-left">
                <v-dialog
                  v-model="protocolInformationDialog[props.item.id]"
                  lazy
                  width="800px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn small class="info" v-on="on">
                      {{ getSequenceTypeTitle(props.item) }}
                    </v-btn>
                  </template>
                  <protocol-information :series="props.item" />
                </v-dialog>
              </td>
              <td class="text-xs-left">
                {{ getSpatialResolution(props.item) }}
              </td>
              <td>
                <div
                  v-for="group in getStudyGroupsByDicomSeries(props.item)"
                  :key="group"
                  class="text-xs-left"
                >
                  <v-chip small>
                    {{ stringifyGroup(getGroupByUrl(group)) }}
                  </v-chip>
                </div>
              </td>
              <td>
                <v-dialog
                  v-model="scanInfoDialog[props.item.id]"
                  lazy
                  width="800px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      small
                      color="success"
                      v-if="getScanByDicomSeries(props.item)"
                      v-on="on"
                    >
                      {{ `Scan #${getScanByDicomSeries(props.item).id}` }}
                    </v-btn>
                    <v-btn
                      small
                      v-else
                      color="warning"
                      v-on="on"
                      :disabled="!patient.subject"
                    >
                      Create
                    </v-btn>
                  </template>
                  <scan-info
                    :existingScan="getScanByDicomSeries(props.item)"
                    :dicom="props.item"
                    @close-scan-dialog="scanInfoDialog[props.item.id] = false"
                  />
                </v-dialog>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import GroupAssociation from './group-association.vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import ProtocolInformation from './protocol-information.vue'
import ScanInfo from '@/components/mri/scan-info.vue'

export default {
  name: 'SeriesTable',
  props: { patient: Object },
  components: { ProtocolInformation, ScanInfo },
  created() {
    this.fetchSequenceTypes()
    if (this.patient) {
      this.fetchPatientSeriesList(this.patient)
    }
  },
  computed: {
    ...mapState('dicom', ['seriesList']),
    ...mapState('mri', ['sequenceTypes', 'series']),
    ...mapGetters('mri', [
      'getDicomSeriesSequenceType',
      'getStudyGroupsByDicomSeries',
      'getScanByDicomSeries'
    ]),
    ...mapGetters('research', ['getGroupByUrl'])
  },
  data: () => ({
    protocolInformationDialog: {},
    scanInfoDialog: {},
    studyGroups: {},
    selectedSeries: [],
    headers: [
      { text: 'Number', value: 'number' },
      { text: 'Description', value: 'description' },
      { text: 'Time', value: 'time' },
      { text: 'Sequence Type', value: 'sequenceType' },
      { text: 'Spatial Resolution (mm)', value: 'spatialResolution' },
      { text: 'Study Groups', value: 'studyGroups' },
      { text: 'Scan Instance', value: 'scanInstance' }
    ]
  }),
  watch: {
    seriesList: function(list) {
      this.updateScans(list)
    }
  },
  methods: {
    getSequenceTypeTitle(series) {
      let type = this.getDicomSeriesSequenceType(series)
      return type ? type.title : 'Undefined'
    },
    getSpatialResolution(series) {
      let spatialResolution = series.pixelSpacing.concat(series.sliceThickness)
      return formatSpatialResolution(spatialResolution)
    },
    stringifyGroup(group) {
      return `${group.study.title} | ${group.title}`
    },
    ...mapActions('dicom', ['fetchPatientSeriesList']),
    ...mapActions('mri', [
      'getOrCreateScanInfoFromDicomSeries',
      'fetchSequenceTypes',
      'updateScans'
    ])
  }
}

function formatSpatialResolution(floatArray) {
  return floatArray
    .map(item => parseFloat(item.toFixed(2)))
    .toString()
    .replace(/,/g, ' x ')
    .trim()
}
</script>

<style scoped></style>
