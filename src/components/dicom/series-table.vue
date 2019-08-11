<template>
  <v-layout column pb-5>
    <series-table-controls
      ref="tableController"
      :pagination="pagination"
      :patient="patient"
      @fetch-series-start="loading = true"
      @fetch-series-end="loading = false"
    />
    <v-data-table
      item-key="id"
      v-model="selectedSeries"
      :headers="headers"
      :items="seriesList"
      :loading="loading"
      :pagination.sync="pagination"
      :rows-per-page-items="pagination.rowsPerPageItems"
      :total-items="seriesCount"
    >
      <template v-slot:items="props">
        <tr>
          <!-- Number -->
          <td class="text-xs-left" style="width: 50px;">
            {{ props.item.number }}
          </td>

          <!-- Description -->
          <td class="text-xs-left">
            {{ props.item.description }}
          </td>

          <!-- Date -->
          <td class="text-xs-left">
            {{ props.item.date.slice(0, 10) | formatDate }}
          </td>

          <!-- Time -->
          <td class="text-xs-left">
            {{ props.item.time.slice(0, 8) }}
          </td>

          <!-- Protocol Information -->
          <td class="text-xs-center">
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

          <!-- Spatial Resolution -->
          <td class="text-xs-center">
            {{ getSpatialResolution(props.item) }}
          </td>

          <!-- Scan Instance Dialog -->
          <td class="text-xs-left">
            <v-dialog
              lazy
              v-if="getScanByDicomSeries(props.item)"
              v-model="scanInfoDialog[props.item.id]"
              width="800px"
            >
              <template v-slot:activator="{ on }">
                <v-btn small color="success" v-on="on">
                  {{ `Scan #${getScanByDicomSeries(props.item).id}` }}
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
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { formatSpatialResolution } from '@/components/dicom/utils'
import ProtocolInformation from './protocol-information.vue'
import SeriesTableControls from '@/components/dicom/series-table-controls.vue'
import ScanInfo from '@/components/mri/scan-info.vue'

export default {
  name: 'SeriesTable',
  props: { patient: Object },
  components: { ProtocolInformation, ScanInfo, SeriesTableControls },
  data: () => ({
    protocolInformationDialog: {},
    scanInfoDialog: {},
    studyGroups: {},
    selectedSeries: [],
    headers: [
      { text: 'Number', value: 'number', width: '20px' },
      {
        text: 'Description',
        value: 'description',
        width: '400px',
        sortable: false
      },
      { text: 'Date', value: 'date', width: '100px' },
      { text: 'Time', value: 'time', width: '100px' },
      {
        text: 'Sequence Type',
        value: 'sequenceType',
        width: '200px',
        sortable: false,
        align: 'center'
      },
      {
        text: 'Spatial Resolution (mm)',
        value: 'spatialResolution',
        sortable: false,
        align: 'center',
        width: '100px'
      },
      {
        text: 'Scan Instance',
        value: 'scanInstance',
        sortable: false,
        width: '50px'
      }
    ],
    pagination: {
      rowsPerPage: 10,
      page: 1,
      sortBy: 'number',
      descending: false,
      rowsPerPageItems: [
        10,
        25,
        50,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: 100000 }
      ]
    },

    loading: false
  }),
  computed: {
    ...mapState('dicom', ['seriesList', 'seriesCount']),
    ...mapState('mri', ['sequenceTypes']),
    ...mapGetters('mri', ['getDicomSeriesSequenceType', 'getScanByDicomSeries'])
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
    }
  }
}
</script>

<style scoped></style>
