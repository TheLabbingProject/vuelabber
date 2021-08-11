<template>
  <v-row class="pa-4 align-left" v-if="showControls">
    <v-col :cols="1" style="max-width: 100px;">
      <v-text-field label="ID" v-model="filters.id" />
    </v-col>
    <v-col :cols="2">
      <v-text-field
        label="Title"
        v-model="filters.title"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
    <v-col>
      <v-text-field
        label="Description"
        v-model="filters.description"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
    <v-spacer />
    <div class="pa-4">
      <v-dialog
        v-model="eventAssociationDialog"
        width="600px"
        v-if="user.isStaff"
      >
        <template v-slot:activator="{ on }">
          <v-btn small color="orange lighten-2" v-on="on">
            Add Event
          </v-btn>
        </template>
        <event-association-card
          @close-event-association-dialog="eventAssociationDialog = false"
          @new-event-created="update"
          @existing-event-associated="update"
          :procedure="procedure"
        />
      </v-dialog>
    </div>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import EventAssociationCard from '@/components/research/event-association-card.vue'

export default {
  name: 'ProcedureStepTableControls',
  props: {
    options: Object,
    procedure: Object,
    showControls: { type: Boolean, default: true }
  },
  components: { EventAssociationCard },
  created() {
    if (this.procedure) {
      this.filters.procedure = this.procedure.id
    }
    this.update()
  },
  data: () => ({
    filters: {
      id: '',
      index: '',
      title: '',
      description: '',
      procedure: ''
    },
    eventAssociationDialog: false
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    ...mapState('auth', ['user'])
  },
  methods: {
    update() {
      this.$emit('fetch-procedure-steps-start')
      this.fetchDataAcquisitionModels({ filters: {}, options: {} }).then(() => {
        this.fetchProcedureSteps(this.query).then(() => {
          this.$emit('fetch-procedure-steps-end')
        })
      })
    },
    ...mapActions('research', [
      'fetchProcedureSteps',
      'fetchDataAcquisitionModels'
    ])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    options: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
