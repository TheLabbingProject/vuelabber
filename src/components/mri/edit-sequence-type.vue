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
        :disabled="Boolean(fromScan)"
        :items="scanningSequenceItems"
      />

      <!-- Sequence Variants -->
      <v-select
        chips
        multiple
        label="Sequence Variants"
        v-model="sequenceType.sequenceVariant"
        :disabled="Boolean(fromScan)"
        :items="sequenceVarianItems"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <div v-if="existingSequenceType">
        <v-btn flat class="warning" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn flat class="success" @click="updateSequenceTypeCaller">
          Update
        </v-btn>
      </div>
      <div v-else>
        <v-btn flat class="success" @click="createSequenceTypeCaller">
          Create
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'
import { mapActions, mapState } from 'vuex'
import { createSelectItems } from '@/components/utils'

export default {
  name: 'EditSequenceType',
  props: {
    existingSequenceType: Object,
    fromScan: Object
  },
  created() {
    if (this.existingSequenceType) {
      this.sequenceType = Object.assign({}, this.existingSequenceType)
    } else if (this.fromScan && this.fromScan.dicom) {
      this.setSequenceDefinitionFromDicomUrl(this.fromScan.dicom)
    }
  },
  data: () => ({
    sequenceType: Object.assign({}, cleanSequenceType),
    scanningSequences,
    sequenceVariants
  }),
  computed: {
    scanningSequenceItems: function() {
      return createSelectItems(this.scanningSequences, 'name')
    },
    sequenceVarianItems: function() {
      return createSelectItems(this.sequenceVariants, 'name')
    },
    ...mapState('dicom', ['seriesList'])
  },
  methods: {
    setSequenceDefinitionFromDicomUrl(dicomUrl) {
      let splitUrl = dicomUrl.split('/')
      let dicomId = Number(splitUrl[splitUrl.length - 2])
      this.fetchSeries({
        filters: { id: dicomId },
        pagination: {}
      }).then(({ scanningSequence, sequenceVariant }) => {
        this.sequenceType.scanningSequence = scanningSequence
        this.sequenceType.sequenceVariant = sequenceVariant
      })
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    createSequenceTypeCaller() {
      this.createSequenceType(this.sequenceType)
        .then(this.$emit('created-sequence-type'))
        .then(this.closeDialog())
    },
    updateSequenceTypeCaller() {
      this.updateSequenceType(this.sequenceType).then(this.closeDialog())
    },
    ...mapActions('dicom', ['fetchSeries']),
    ...mapActions('mri', ['createSequenceType', 'updateSequenceType'])
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
