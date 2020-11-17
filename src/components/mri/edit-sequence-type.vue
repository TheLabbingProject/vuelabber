<template>
  <v-card>
    <v-card-title class="success darken-2">
      <div class="headline">
        <span v-if="!existingSequenceType" class="white--text"
          >Create Sequence Type</span
        >
        <span v-else class="white--text">Edit Existing Sequence Type</span>
      </div>
    </v-card-title>
    <v-card-text>
      <!-- Title -->
      <v-text-field
        label="Title"
        v-model="sequenceType.title"
        :counter="64"
        :rules="[rules.required]"
      />

      <!-- Description -->
      <v-textarea label="Description" v-model="sequenceType.description" />

      <div v-if="!existingSequenceType">
        <!-- Scanning Sequence -->
        <v-select
          chips
          multiple
          label="Scanning Sequence"
          v-model="sequenceType.scanningSequence"
          :disabled="Boolean(fromScan)"
          :items="scanningSequenceItems"
          :rules="[rules.requiredMultiple]"
        />

        <!-- Sequence Variants -->
        <v-select
          chips
          multiple
          label="Sequence Variants"
          v-model="sequenceType.sequenceVariant"
          :disabled="Boolean(fromScan)"
          :items="sequenceVariantItems"
          :rules="[rules.requiredMultiple]"
        />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <div v-if="existingSequenceType">
        <v-btn text class="warning" @click="closeDialog">Cancel</v-btn>
        <v-btn text class="success" @click="updateSequenceTypeCaller"
          >Update</v-btn
        >
      </div>
      <div v-else>
        <v-btn text class="success" @click="createSequenceTypeCaller"
          >Create</v-btn
        >
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
      this.setSequenceDefinitionFromDicom(this.fromScan.dicom)
    }
  },
  data: () => ({
    sequenceType: Object.assign({}, cleanSequenceType),
    scanningSequenceItems: createSelectItems(scanningSequences, 'name'),
    sequenceVariantItems: createSelectItems(sequenceVariants, 'name'),
    rules: {
      required: value => !!value || 'Required!',
      requiredMultiple: value => Boolean(value.length) || 'Required!'
    }
  }),
  computed: {
    ...mapState('dicom', ['seriesList'])
  },
  methods: {
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
    setSequenceDefinitionFromDicom(dicomId) {
      this.fetchSeries({
        filters: { id: dicomId },
        options: {}
      }).then(({ scanningSequence, sequenceVariant }) => {
        this.sequenceType['scanningSequence'] = scanningSequence
        this.sequenceType['sequenceVariant'] = sequenceVariant
      })
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
