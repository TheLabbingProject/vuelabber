<template>
  <v-col>
    <series-table-controls
      ref="controls"
      :options="options"
      :patient="patient"
      @fetch-series-start="loading = true"
      @fetch-series-end="loading = false"
    />
    <v-data-table
      dense
      item-key="id"
      v-model="selectedSeries"
      :headers="headers"
      :items="seriesList"
      :loading="loading"
      :options.sync="options"
      :server-items-length="seriesCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <!-- Date -->
      <template v-slot:item.date="{ item }">{{
        item.date.slice(0, 10) | formatDate
      }}</template>

      <!-- Time -->
      <template v-slot:item.time="{ item }">{{
        item.time.slice(0, 8)
      }}</template>

      <!-- Sequence Type -->
      <template v-slot:item.sequenceType="{ item }">
        {{ item.sequenceType }}
      </template>

      <!-- Spatial Resolution -->
      <template v-slot:item.spatialResolution="{ item }">{{
        getSpatialResolution(item)
      }}</template>

      <!-- Scan Instance Dialog -->
      <template v-slot:item.scanInstance="{ item }">
        <div class="py-1">
          <v-dialog
            v-if="getScanByDicomSeries(item)"
            v-model="scanInfoDialog[item.id]"
            width="500px"
          >
            <template v-slot:activator="{ on }">
              <v-btn small color="success" v-on="on">{{
                `Scan #${getScanByDicomSeries(item).id}`
              }}</v-btn>
            </template>
            <scan-info
              :existingScan="getScanByDicomSeries(item)"
              :dicom="item"
              @close-scan-dialog="scanInfoDialog[item.id] = false"
            />
          </v-dialog>
        </div>
      </template>
    </v-data-table>
  </v-col>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { formatSpatialResolution } from '@/components/dicom/utils'
import SeriesTableControls from '@/components/dicom/series-table-controls.vue'
import ScanInfo from '@/components/mri/scan-info.vue'

export default {
  name: 'SeriesTable',
  props: { patient: Object },
  components: { ScanInfo, SeriesTableControls },
  data: () => ({
    protocolInformationDialog: {},
    scanInfoDialog: {},
    selectedSeries: [],
    headers: [
      { text: 'Number', value: 'number', width: '5%' },
      {
        text: 'Description',
        value: 'description',
        sortable: false,
        width: '30%'
      },
      {
        text: 'Date',
        value: 'date',
        align: 'center',
        width: '12%'
      },
      {
        text: 'Time',
        value: 'time',
        align: 'center',
        width: '12%'
      },
      {
        text: 'Sequence Type',
        value: 'sequenceType',
        align: 'center',
        width: '15%'
      },
      {
        text: 'Spatial Resolution (mm)',
        value: 'spatialResolution',
        sortable: false,
        align: 'center',
        width: '16%'
      },
      {
        text: 'Scan Instance',
        value: 'scanInstance',
        sortable: false,
        width: '15%'
      }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['number'],
      descending: false
    },
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false
  }),
  computed: {
    ...mapState('dicom', ['seriesList', 'seriesCount']),
    ...mapGetters('mri', ['getScanByDicomSeries'])
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
