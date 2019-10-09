<template>
  <div>
    <v-data-table
      item-key="id"
      :headers="headers"
      :items="sequenceTypes"
      :loading="loading"
    >
      <template v-slot:items="props">
        <tr>
          <td class="text-xs-left">
            {{ props.item.title }}
          </td>
          <td class="text-xs-left">
            <v-flex class="py-4">
              <div
                class="text-xs-left"
                v-for="(sequence, index) in props.item.scanningSequence"
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
          </td>
          <td class="text-xs-left">
            <v-flex class="py-4">
              <div
                class="text-xs-left"
                v-for="(variant, index) in props.item.sequenceVariant"
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
          </td>
          <td class="text-xs-left">
            {{ props.item.description }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'

export default {
  name: 'SequenceTypes',
  created() {
    this.fetchSequenceTypes()
  },
  data: () => ({
    loading: false,
    headers: [
      { text: 'Title', value: 'title', align: 'left' },
      { text: 'Scanning Sequence', value: 'scanningSequence', align: 'left' },
      { text: 'Variants', value: 'sequenceVariants', align: 'left' },
      { text: 'Description', value: 'description', align: 'left' }
    ]
  }),
  computed: {
    ...mapState('mri', ['sequenceTypes'])
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
    ...mapActions('mri', ['fetchSequenceTypes'])
  }
}
</script>

<style lang="scss" scoped></style>
