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
        :items="scanningSequenceItems"
      />

      <!-- Sequence Variants -->
      <v-select
        chips
        multiple
        label="Sequence Variants"
        v-model="sequenceType.sequenceVariant"
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
import { mapActions } from 'vuex'

export default {
  name: 'EditSequenceType',
  props: {
    existingSequenceType: Object
  },
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
    scanningSequenceItems: function() {
      return this.createSelectItems(this.scanningSequences)
    },
    sequenceVarianItems: function() {
      return this.createSelectItems(this.sequenceVariants)
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },
    createSelectItem(key, object) {
      return {
        text: object[key]['name'],
        value: key
      }
    },
    createSelectItems(object) {
      let keys = Object.keys(object)
      return keys.map(key => this.createSelectItem(key, object))
    },
    createSequenceTypeCaller() {
      this.createSequenceType(this.sequenceType).then(this.closeDialog())
    },
    updateSequenceTypeCaller() {
      this.updateSequenceType(this.sequenceType).then(this.closeDialog())
    },
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
