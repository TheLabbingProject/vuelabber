<template>
  <v-tabs v-model="active">
    <!-- Create new event -->
    <v-tab>New</v-tab>
    <v-tab-item>
      <v-card>
        <v-card-text>
          <v-form class="px-3" @submit.prevent>
            <!-- Title -->
            <v-text-field
              label="Title"
              v-model="event.title"
              :class="{ hasError: $v.event.title.$error }"
              :counter="255"
              :error-messages="titleErrors"
              @blur="checkIfValid()"
            />

            <!-- Description -->
            <v-textarea v-model="event.description" label="Description" />

            <!-- Type -->
            <v-radio-group v-model="event.type" row>
              <v-radio
                label="Data Acquisition"
                value="MeasurementDefinition"
              ></v-radio>
              <v-radio label="Task" value="Task"></v-radio>
            </v-radio-group>

            <!-- Data acquisition model selection -->
            <div v-if="dataAquisition">
              <v-autocomplete
                label="Data Model"
                :items="dataModels"
                v-model="dataModel"
              ></v-autocomplete>
            </div>
          </v-form>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer />
          <!-- Create new event -->
          <v-btn
            color="success"
            :disabled="$v.event.$error"
            @click="createNewEvent"
          >
            Create
          </v-btn>

          <!-- Cancel event creation/update -->
          <v-btn color="error" @click="$emit('close-event-association-dialog')">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-tab-item>
    <v-tab>Existing</v-tab>
    <v-tab-item>
      <v-card>
        <v-card-text>
          <v-form class="px-3" @submit.prevent>
            <v-col>
              <v-autocomplete
                clearable
                label="Event"
                v-model="selectedEvent"
                :items="eventItems"
                :loading="loadingEventItems"
                :search-input.sync="existingEventQuery"
                @focus="updateEventItems"
                @update:list-index="updateEventItems"
              />
            </v-col>
          </v-form>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer />
          <!-- Create new event -->
          <v-btn color="success" @click="associateSelectedEvent">
            Associate
          </v-btn>

          <!-- Cancel event creation/update -->
          <v-btn color="error" @click="closeDialog">
            Cancel
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
  name: 'EventAssociationCard',
  props: {
    procedure: { type: Object, default: undefined }
  },
  mixins: [validationMixin],
  data: () => ({
    active: 0,
    event: { title: '', description: '', type: 'MeasurementDefinition' },
    selectedEvent: null,
    loadingEventItems: false,
    existingEventQuery: null,
    dataModels: [
      {
        text: 'MRI Session',
        value: { appLabel: 'django_mri', model: 'session' }
      }
    ],
    dataModel: { appLabel: 'django_mri', model: 'session' }
  }),
  computed: {
    titleErrors: function() {
      const errors = []
      if (!this.$v.event.title.$dirty) return errors
      !this.$v.event.title.maxLength &&
        errors.push('Title must be at most 255 characters long!')
      !this.$v.event.title.required && errors.push('Title is required.')
      return errors
    },
    dataAquisition: function() {
      return this.event.type === 'MeasurementDefinition'
    },
    ...mapState('research', ['dataAcquisitionModels', 'eventItems'])
  },
  validations: {
    event: {
      title: { required, maxLength: maxLength(255) }
    }
  },
  methods: {
    closeDialog: function() {
      this.$v.$reset()
      this.$emit('close-event-association-dialog')
    },
    createNewEvent: function() {
      // Validation
      this.$v.event.$touch()
      if (this.$v.event.$error) return

      // Fix data model setting
      if (this.dataModel != null) {
        this.event['contentType'] = this.dataAcquisitionModels.find(
          model =>
            model.appLabel == this.dataModel.appLabel &&
            model.model == this.dataModel.model
        ).id
      }

      // Create
      this.createEvent(this.event)
        .then(newEvent => {
          if (this.procedure != undefined) {
            let data = {
              event: newEvent.id,
              procedure: this.procedure.id,
              index: null
            }
            this.createProcedureStep(data)
          }
        })
        .then(() => this.$emit('new-event-created'))
        .then(() => this.closeDialog())
    },
    associateSelectedEvent: function() {
      let data = {
        procedure: this.procedure.id,
        event: this.selectedEvent,
        index: null
      }
      this.createProcedureStep(data)
        .then(() => this.$emit('existing-event-associated'))
        .then(() => this.closeDialog())
    },
    checkIfValid() {
      this.$v.event.$dirty
        ? this.$v.event.$reset() && this.$v.event.$touch()
        : this.$v.event.$touch()
    },
    updateEventItems() {
      let value = this.existingEventQuery == null ? '' : this.existingEventQuery
      let query = {
        filters: { title: value, excludeProcedure: this.procedure.id },
        options: {}
      }
      this.loadingEventItems = true
      this.fetchEventItems(query).then(() => (this.loadingEventItems = false))
    },
    ...mapActions('research', [
      'createEvent',
      'createProcedureStep',
      'fetchEventItems',
      'patchProcedure'
    ])
  }
}
</script>

<style scoped></style>
