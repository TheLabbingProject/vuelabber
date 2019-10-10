<template>
  <v-layout column>
    <v-layout pb-2 row>
      <v-spacer />
      <v-dialog v-model="createSequenceTypeDialog" width="400px" lazy>
        <template v-slot:activator="{ on }">
          <v-btn class="success" v-on="on">
            Create
          </v-btn>
        </template>
        <edit-sequence-type />
      </v-dialog>
    </v-layout>
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
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'
import EditSequenceType from '@/components/mri/edit-sequence-type.vue'

export default {
  name: 'SequenceTypes',
  components: { EditSequenceType },
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
    ],
    createSequenceTypeDialog: false
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
