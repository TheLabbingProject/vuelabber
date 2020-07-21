<template>
  <v-card>
    <v-card-title class="success darken-2 justify-center">
      <div class="headline">
        <span
          v-if="! existingSequenceTypeDefinition"
          class="white--text"
        >Create Sequence Type Definition</span>
        <span
          v-else
          class="white--text"
        >Edit Existing Sequence Type Definition #{{ sequenceTypeDefinition.id }}</span>
      </div>
    </v-card-title>
    <v-card-text>
      <!-- Scanning Sequence -->
      <v-select
        chips
        multiple
        label="Scanning Sequence"
        v-model="sequenceTypeDefinition.scanningSequence"
        :disabled="Boolean(fromScan)"
        :items="scanningSequenceItems"
        :rules="[rules.requiredMultiple]"
      />

      <!-- Sequence Variants -->
      <v-select
        chips
        multiple
        label="Sequence Variants"
        v-model="sequenceTypeDefinition.sequenceVariant"
        :disabled="Boolean(fromScan)"
        :items="sequenceVariantItems"
        :rules="[rules.requiredMultiple]"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <div v-if="existingSequenceTypeDefinition">
        <v-btn text class="warning" @click="closeDialog">Cancel</v-btn>
        <v-btn text class="success" @click="updateSequenceTypeDefinitionCaller">Update</v-btn>
      </div>
      <div v-else>
        <v-btn text class="success" @click="createSequenceTypeDefinitionCaller">Create</v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'
import { mapActions, mapState } from 'vuex'
import { createSelectItems } from '@/components/utils'

export default {
  name: 'EditSequenceTypeDefinition',
  props: {
    sequenceTypeId: Number,
    existingSequenceTypeDefinition: Object,
    fromScan: Object
  },
  created() {
    if (this.existingSequenceTypeDefinition) {
      this.sequenceTypeDefinition = Object.assign(
        {},
        this.existingSequenceTypeDefinition
      )
    } else if (this.fromScan && this.fromScan.dicom) {
      this.setSequenceDefinitionFromDicomUrl(this.fromScan.dicom)
    }
  },
  data: () => ({
    sequenceTypeDefinition: Object.assign({}, cleanSequenceTypeDefinition),
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
    setSequenceDefinitionFromDicomUrl(dicomUrl) {
      let splitUrl = dicomUrl.split('/')
      let dicomId = Number(splitUrl[splitUrl.length - 2])
      this.fetchSeries({
        filters: { id: dicomId },
        options: {}
      }).then(({ scanningSequence, sequenceVariant }) => {
        this.sequenceTypeDefinition['scanningSequence'] = scanningSequence
        this.sequenceTypeDefinition['sequenceVariant'] = sequenceVariant
      })
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    updateSequenceTypeDefinitionCaller() {
      this.updateSequenceTypeDefinition(this.sequenceTypeDefinition).then(
        this.closeDialog()
      )
    },
    createSequenceTypeDefinitionCaller() {
      this.sequenceTypeDefinition['sequence_id'] = this.sequenceTypeId
      delete this.sequenceTypeDefinition['id']
      this.createSequenceTypeDefinition(this.sequenceTypeDefinition).then(
        this.closeDialog()
      )
    },
    ...mapActions('dicom', ['fetchSeries']),
    ...mapActions('mri', [
      'updateSequenceTypeDefinition',
      'createSequenceTypeDefinition'
    ])
  }
}

const cleanSequenceTypeDefinition = {
  id: 0,
  scanningSequence: [],
  sequenceVariant: []
}
</script>

<style lang="scss" scoped></style>
