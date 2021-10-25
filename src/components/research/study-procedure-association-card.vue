<template>
  <v-tabs v-model="active">
    <!-- Create new procedure -->
    <v-tab>
      {{ newTabTitle }}
    </v-tab>
    <v-tab-item>
      <v-card>
        <v-card-text>
          <v-col>
            <v-form @submit.prevent>
              <!-- Title -->
              <v-text-field
                label="Title"
                v-model="procedure.title"
                :class="{ hasError: $v.procedure.title.$error }"
                :counter="255"
                :error-messages="titleErrors"
                @blur="checkIfValid()"
                autofocus
              />

              <!-- Description -->
              <v-textarea v-model="procedure.description" label="Description" />
            </v-form>
          </v-col>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer />
          <!-- Create new procedure -->
          <v-btn
            :color="createButton.color"
            :disabled="$v.procedure.$error"
            @click="createNewProcedure"
          >
            {{ createButton.label }}
          </v-btn>

          <!-- Cancel procedure creation/update -->
          <v-btn :color="cancelButton.color" @click="closeDialog">
            {{ cancelButton.label }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-tab-item>
    <v-tab>
      {{ existingTabTitle }}
    </v-tab>
    <v-tab-item>
      <v-card>
        <v-card-text>
          <v-col>
            <v-form @submit.prevent>
              <v-col>
                <v-autocomplete
                  clearable
                  label="Procedure"
                  v-model="selectedProcedure"
                  item-text="title"
                  item-value="id"
                  :items="procedureItems"
                  :loading="loadingProcedures"
                  :search-input.sync="existingProcedureQuery"
                  @focus="updateProcedureItems"
                  @update:list-index="updateProcedureItems"
                  autofocus
                />
              </v-col>
            </v-form>
          </v-col>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer />
          <!-- Create new procedure -->
          <v-btn
            :color="associateButton.color"
            @click="associateSelectedProcedure"
          >
            {{ associateButton.label }}
          </v-btn>

          <!-- Cancel procedure creation/update -->
          <v-btn :color="cancelButton.color" @click="closeDialog">
            {{ cancelButton.label }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'StudyProcedureAssociationCard',
  props: {
    study: { type: Object, default: () => undefined }
  },
  mixins: [validationMixin],
  data: () => ({
    active: 0,
    procedure: { title: '', description: '' },
    selectedProcedure: null,
    loadingProcedures: false,
    existingProcedureQuery: null,
    newTabTitle: 'New',
    existingTabTitle: 'Existing',
    cancelButton: { label: 'Cancel', color: 'error' },
    createButton: { label: 'Create', color: 'success' },
    associateButton: { label: 'Associate', color: 'success' }
  }),
  computed: {
    titleErrors: function() {
      const errors = []
      if (!this.$v.procedure.title.$dirty) return errors
      !this.$v.procedure.title.maxLength &&
        errors.push('Title must be at most 255 characters long!')

      !this.$v.procedure.title.required && errors.push('Title is required.')
      return errors
    },
    ...mapState('research', ['procedureItems'])
  },
  validations: {
    procedure: {
      title: { required, maxLength: maxLength(255) }
    }
  },
  methods: {
    closeDialog: function() {
      this.$v.$reset()
      this.$emit('close-procedure-association-dialog')
    },
    createNewProcedure: function() {
      // Validation
      this.$v.procedure.$touch()
      if (this.$v.procedure.$error) return

      // Create
      this.createProcedure(this.procedure)
        .then(newProcedure => {
          // Associate with study property if passed
          if (this.study != undefined) {
            let procedures = this.study.procedures || []
            procedures.push(newProcedure.id)
            let data = { id: this.study.id, procedures }
            this.patchStudy(data).then(() => {
              this.$emit('new-procedure-created')
            })
          } else {
            this.$emit('new-procedure-created')
          }
        })
        .then(() => this.closeDialog())
    },
    associateSelectedProcedure: function() {
      this.study.procedures.push(this.selectedProcedure)
      let data = { id: this.study.id, procedures: this.study.procedures }
      this.patchStudy(data)
        .then(() => {
          this.$emit('existing-procedure-associated')
        })
        .then(() => this.closeDialog())
    },
    checkIfValid() {
      this.$v.procedure.$dirty
        ? this.$v.procedure.$reset() && this.$v.procedure.$touch()
        : this.$v.procedure.$touch()
    },
    updateProcedureItems() {
      let value =
        this.existingProcedureQuery == null ? '' : this.existingProcedureQuery
      let query = {
        filters: { title: value, excludeStudy: this.study.id },
        options: {}
      }
      this.loadingProcedures = true
      this.fetchProcedures({ query, queryItems: true }).then(
        () => (this.loadingProcedures = false)
      )
    },
    ...mapActions('research', [
      'createProcedure',
      'fetchProcedures',
      'patchStudy'
    ])
  }
}
</script>

<style scoped></style>
