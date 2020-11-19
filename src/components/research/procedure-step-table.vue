<template>
  <div class="pa-4">
    <v-data-table
      dense
      item-key="id"
      :headers="headers"
      :items="procedureSteps"
      :loading="loading"
      :options.sync="options"
      :server-items-length="procedureStepCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <procedure-step-table-controls
          :options="options"
          :procedure="procedure"
          :showControls="showControls"
          @fetch-procedure-steps-start="loading = true"
          @fetch-procedure-steps-end="loading = false"
          ref="controls"
        />
      </template>

      <template v-slot:item.event.type="{ item }">
        {{ getTypeDisplay(item.event.type) }}
      </template>

      <!-- Title -->
      <template v-slot:item.event.title="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.event.title"
          large
          @save="saveEvent(item.event)"
        >
          <div>{{ item.event.title }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.event.title"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Description -->
      <template v-slot:item.event.description="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.event.description"
          large
          @save="saveEvent(item.event)"
        >
          <div>{{ item.event.description }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.event.description"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ProcedureStepTableControls from '@/components/research/procedure-step-table-controls.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ProcedureStepTable',
  components: { ProcedureStepTableControls },
  props: { procedure: Object, showControls: Boolean },
  data: () => ({
    headers: [
      { text: 'Index', value: 'index', align: 'left', width: 1 },
      { text: 'Type', value: 'event.type' },
      { text: 'Title', value: 'event.title' },
      { text: 'Description', value: 'event.description' }
    ],
    options: {
      itemsPerPage: 10,
      page: 1,
      sortBy: ['index'],
      sortDesc: [false]
    },
    itemsPerPageOptions: [10, 20, 30],
    loading: false,
    procedureStepDialog: false,
    chosenIndex: -1
  }),
  computed: {
    ...mapState('research', ['procedureSteps', 'procedureStepCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    saveEvent(event) {
      this.updateEvent(event)
    },
    getTypeDisplay(type) {
      return type == 'MeasurementDefinition' ? 'Data Acquisition' : type
    },
    ...mapActions('research', ['updateEvent'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.procedureStep-info {
  background-color: #dfe9fd;
}
</style>
