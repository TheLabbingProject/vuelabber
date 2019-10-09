<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>
      {{ sequenceType.title }} Protocol Information
    </v-card-title>
    <v-card-text>
      <v-layout column class="text-left">
        <v-flex v-if="sequenceType.description">
          <div class="grey--text text--darken-2 font-italic">
            {{ sequenceType.description }}
          </div>
          <v-divider />
        </v-flex>
        <v-layout row wrap>
          <v-layout column>
            <v-subheader>
              Scanning Sequence
            </v-subheader>
            <v-flex class="pl-3">
              <div
                class="text-xs-left"
                v-for="(sequence, index) in sequenceType.scanningSequence"
                :key="index"
              >
                <v-chip small>
                  <v-avatar :color="getScanningSequenceColor(sequence)">
                    {{ sequence }}
                  </v-avatar>
                  {{ getScanningSequenceName(sequence) }}
                </v-chip>
              </div>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-subheader>
              Sequence Variant
            </v-subheader>
            <v-flex class="pl-3">
              <div
                class="text-xs-left"
                v-for="(variant, index) in sequenceType.sequenceVariant"
                :key="index"
              >
                <v-chip small>
                  <v-avatar :color="getSequenceVariantColor(variant)">{{
                    variant
                  }}</v-avatar>
                  {{ getSequenceVariantName(variant) }}
                </v-chip>
              </div>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-subheader>
              Acquisition Parameters
            </v-subheader>
            <v-flex class="pl-3">
              <div
                class="text-xs-left"
                v-for="(value, parameter) in getSeriesParameters(
                  series || scan
                )"
                :key="parameter"
              >
                <v-chip small v-if="value">
                  <v-avatar :color="getSeriesParameterColor(parameter)">
                    <span
                      v-if="parameter == 'repetitionTime'"
                      class="white--text"
                    >
                      {{ getSeriesParameterName(parameter) }}</span
                    >
                    <span v-else class="black--text">
                      {{ getSeriesParameterName(parameter) }}</span
                    >
                  </v-avatar>
                  {{ value.toLocaleString() }}
                </v-chip>
              </div>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'

export default {
  name: 'ProtocolInformation',
  props: { series: Object, scan: Object },
  created() {
    if (this.series) {
      this.sequenceType = this.getDicomSeriesSequenceType(this.series)
    } else if (this.scan) {
      this.sequenceType = this.getSequenceTypeByUrl(this.scan.sequenceType)
    }
  },
  computed: {
    ...mapGetters('mri', ['getSequenceTypeByUrl']),
    ...mapGetters('mri', ['getDicomSeriesSequenceType'])
  },
  data: () => ({
    sequenceType: null,
    headers: [
      {
        text: 'Scanning Sequence',
        align: 'left',
        sortable: false,
        value: 'scanningSequence'
      },
      {
        text: 'Sequence Variant',
        align: 'left',
        sortable: false,
        value: 'sequenceVariant'
      },
      {
        text: 'Scan Parameters (ms)',
        align: 'left',
        sortable: false,
        value: 'scanParameters'
      }
    ]
  }),
  methods: {
    getScanningSequenceName(abbreviation) {
      return scanningSequences[abbreviation].name
    },
    getScanningSequenceColor(abbreviation) {
      return scanningSequences[abbreviation].color
    },
    getSequenceVariantName(abbreviation) {
      return sequenceVariants[abbreviation].name
    },
    getSequenceVariantColor(abbreviation) {
      return sequenceVariants[abbreviation].color
    },
    getSpatialResolution(series) {
      let spatialResolution = series.pixelSpacing.concat(series.sliceThickness)
      return spatialResolution
        .map(item => parseFloat(item.toFixed(2)))
        .toString()
        .replace(/,/g, ' , ')
        .trim()
    },
    getSeriesParameters({ repetitionTime, echoTime, inversionTime }) {
      return { repetitionTime, echoTime, inversionTime }
    },
    getSeriesParameterName(key) {
      return seriesParameters[key].name
    },
    getSeriesParameterColor(key) {
      return seriesParameters[key].color
    }
  }
}

const seriesParameters = {
  repetitionTime: { name: 'TR', color: 'black' },
  echoTime: { name: 'TE', color: 'white' },
  inversionTime: { name: 'TI', color: 'transparent' }
}
</script>

<style scoped></style>
