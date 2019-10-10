<template>
  <v-card>
    <v-card-title class="success darken-2">
      <div class="headline">
        <span class="white--text">
          Create Sequence Type
        </span>
      </div>
    </v-card-title>
    <v-card-text>
      <!-- Title -->
      <v-text-field label="Title" v-model="sequenceType.title" :counter="64" />

      <!-- Description -->
      <v-textarea label="Description" v-model="sequenceType.description" />

      <!-- Scanning Sequence -->
      <v-select
        chips
        multiple
        label="Scanning Sequence"
        v-model="sequenceType.scanningSequence"
        :items="verboseScanningSequenceNames"
      />

      <!-- Sequence Variants -->
      <v-select
        chips
        multiple
        label="Sequence Variants"
        v-model="sequenceType.sequenceVariant"
        :items="verboseSequenceVariantNames"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn flat class="success">
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'

export default {
  name: 'EditSequenceType',
  props: { existingSequenceType: Object },
  created() {
    if (this.existingSequenceType) {
      this.sequenceType = Object.assign({}, this.existingSequenceType)
    }
  },
  data: () => ({
    sequenceType: Object.assign({}, cleanSequenceType),
    scanningSequences,
    sequenceVariants
  }),
  computed: {
    verboseScanningSequenceNames: function() {
      let keys = Object.keys(this.scanningSequences)
      return keys.map(key => this.scanningSequences[key]['name'])
    },
    verboseSequenceVariantNames: function() {
      let keys = Object.keys(this.sequenceVariants)
      return keys.map(key => this.sequenceVariants[key]['name'])
    }
  }
}

const cleanSequenceType = {
  title: '',
  description: '',
  scanningSequence: [],
  sequenceVariant: []
}
</script>

<style lang="scss" scoped></style>
