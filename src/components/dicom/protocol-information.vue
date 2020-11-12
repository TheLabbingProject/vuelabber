<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title
      >{{ sequenceType.title }} Protocol Information</v-card-title
    >
    <v-card-text>
      <v-col>
        <div v-if="sequenceType.description">
          <br />
          <div class="grey--text text--darken-2 font-italic">
            {{ sequenceType.description }}
          </div>
          <br />
          <v-divider />
        </div>
        <v-row>
          <v-col class="text-center">
            <div
              v-for="(definition, index) in sequenceType.sequenceDefinitions"
              :key="index"
            >
              <v-subheader class="justify-left">Scanning Sequence</v-subheader>
              <div
                class="py-1"
                v-for="(sequence, index2) in definition.scanningSequence"
                :key="index2"
              >
                <v-chip small>
                  <v-avatar :color="getScanningSequenceColor(sequence)">{{
                    sequence
                  }}</v-avatar>
                  {{ getScanningSequenceName(sequence) }}
                </v-chip>
              </div>
              <v-subheader class="justify-right">Sequence Variant</v-subheader>
              <div
                class="py-1"
                v-for="(variant, index2) in definition.sequenceVariant"
                :key="index2"
              >
                <v-chip small>
                  <v-avatar :color="getSequenceVariantColor(variant)">
                    {{ variant === 'NONE' ? 'NO' : variant }}
                  </v-avatar>
                  {{ getSequenceVariantName(variant) }}
                </v-chip>
              </div>
              <v-divider
                v-if="index < sequenceType.sequenceDefinitions.length - 1"
              ></v-divider>
            </div>
          </v-col>
          <v-col class="text-center">
            <v-subheader class="justify-center"
              >Acquisition Parameters</v-subheader
            >
            <div
              class="py-1"
              v-for="(value, parameter) in getSeriesParameters(series || scan)"
              :key="parameter"
            >
              <v-chip small v-if="value">
                <v-avatar :color="getSeriesParameterColor(parameter)">
                  <span
                    v-if="parameter == 'repetitionTime'"
                    class="white--text"
                    >{{ getSeriesParameterName(parameter) }}</span
                  >
                  <span v-else class="black--text">{{
                    getSeriesParameterName(parameter)
                  }}</span>
                </v-avatar>
                {{ value.toLocaleString() }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-col>
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
      this.sequenceType = this.scan.sequenceType
    }
  },
  computed: {
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
