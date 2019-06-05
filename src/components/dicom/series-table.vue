<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex><GroupAssociation :selectedSeries="selectedSeries"/></v-flex
    ></v-layout>
    <v-layout row wrap>
      <v-flex>
        <v-data-table
          v-model="selectedSeries"
          :headers="headers"
          :items="seriesList"
          item-key="uid"
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
                  <protocol-information
                    :series="props.item"
                  ></protocol-information>
                </v-dialog>
              </td>
              <td class="text-xs-left">
                {{ getSpatialResolution(props.item) }}
              </td>
              <td>
                <div class="text-xs-left">
                  <v-chip
                    small
                    v-for="group in studyGroups[props.item.id]"
                    :key="group.id"
                    >{{ stringifyGroup(group) }}</v-chip
                  >
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GroupAssociation from './group-association.vue'
import { mapGetters, mapState } from 'vuex'
import ProtocolInformation from './protocol-information.vue'

export default {
  name: 'SeriesTable',
  props: { patient: Object },
  components: { GroupAssociation, ProtocolInformation },
  created() {
    this.$store.dispatch('dicom/fetchPatientSeriesList', this.patient)
    this.$store.dispatch('mri/fetchSequenceTypes')
  },
  computed: {
    ...mapState('dicom', ['seriesList']),
    ...mapState('mri', ['sequenceTypes', 'seriesToScan']),
    ...mapGetters('mri', ['getDicomSeriesSequenceType']),
    ...mapGetters('research', ['getGroupByUrl'])
  },
  watch: {
    seriesList: function(list) {
      this.$store.dispatch('mri/updateSeriesToScan', list)
    },
    seriesToScan: function(newValue) {
      let groups = objectMap(newValue, item =>
        item != null
          ? item.studyGroups.map(url => this.getGroupByUrl(url))
          : null
      )
      this.$set(this, 'studyGroups', groups)
    }
  },
  data: () => ({
    protocolInformationDialog: {},
    studyGroups: {},
    selectedSeries: [],
    headers: [
      { text: 'Number', value: 'number' },
      { text: 'Description', value: 'description' },
      { text: 'Time', value: 'time' },
      { text: 'Sequence Type', value: 'sequenceType' },
      { text: 'Spatial Resolution (mm)', value: 'spatialResolution' },
      { text: 'Study Groups', value: 'studyGroups' }
    ]
  }),
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

function formatSpatialResolution(floatArray) {
  return floatArray
    .map(item => parseFloat(item.toFixed(2)))
    .toString()
    .replace(/,/g, ' x ')
    .trim()
}

// returns a new object with the values at each key mapped using mapFn(value)
function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key])
    return result
  }, {})
}
</script>

<style scoped>
.disable-events {
  pointer-events: none;
}
</style>
