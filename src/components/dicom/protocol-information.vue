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
                v-for="(sequence, index) in series.scanningSequence"
                :key="index"
              >
                <v-chip small>
                  <v-avatar :color="getScanningSequenceColor(sequence)">{{
                    sequence
                  }}</v-avatar>
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
                v-for="(variant, index) in series.sequenceVariant"
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
              AcquisitionParameters
            </v-subheader>
            <v-flex class="pl-3">
              <div
                class="text-xs-left"
                v-for="(value, parameter) in getSeriesParameters(series)"
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

export default {
  name: 'ProtocolInformation',
  props: { series: Object },
  created() {
    this.sequenceType = this.getDicomSeriesSequenceType(this.series)
  },
  computed: {
    ...mapGetters('mri', ['getDicomSeriesSequenceType'])
  },
  data() {
    return {
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
    }
  },
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

const scanningSequences = {
  GR: { name: 'Gradient Recalled', color: 'amber accent-4' },
  SE: { name: 'Spin Echo', color: 'pink accent-4' },
  IR: { name: 'Inversion Recovery', color: 'green accent-4' },
  EP: { name: 'Echo Planar', color: 'cyan accent-4' },
  RM: { name: 'Research Mode', color: 'grey darken-1' }
}

const sequenceVariants = {
  SK: { name: 'Segmented k-Space', color: 'deep-purple lighten-3' },
  MTC: {
    name: 'Magnetization Transfer Contrast',
    color: 'light-blue lighten-3'
  },
  SS: { name: 'Steady State', color: 'teal lighten-3' },
  TRSS: { name: 'Time Reversed Steady State', color: 'light-green lighten-3' },
  SP: { name: 'Spoiled', color: 'lime lighten-3' },
  MP: { name: 'MAG Prepared', color: 'brown lighten-3' },
  OSP: { name: 'Oversampling Phase', color: 'blue-grey lighten-3' },
  NONE: { name: 'None', color: 'grey lighten-2' }
}

const seriesParameters = {
  repetitionTime: { name: 'TR', color: 'black' },
  echoTime: { name: 'TE', color: 'white' },
  inversionTime: { name: 'TI', color: 'transparent' }
}
</script>

<style lang="scss" scoped></style>
