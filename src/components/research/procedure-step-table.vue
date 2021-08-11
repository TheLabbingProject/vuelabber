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
      <!-- Controls -->
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

      <!-- Change index -->
      <template v-slot:[`item.changeIndex`]="{ item }" v-if="user.isStaff">
        <v-icon
          small
          :disabled="item.index + 1 >= procedureStepCount"
          @click="changeIndex(item, item.index + 1)"
        >
          mdi-arrow-down
        </v-icon>
        <v-icon
          small
          :disabled="item.index == 0"
          @click="changeIndex(item, item.index - 1)"
        >
          mdi-arrow-up
        </v-icon>
      </template>

      <!-- Event type -->
      <template v-slot:[`item.eventInfo.type`]="{ item }">
        {{ getTypeDisplay(item.eventInfo.type) }}
      </template>

      <!-- Data model -->
      <template v-slot:[`item.eventInfo.modelName`]="{ item }">
        {{ getDataModelDisplay(item.eventInfo) }}
      </template>

      <!-- Title -->
      <template v-slot:[`item.eventInfo.title`]="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.eventInfo.title"
          large
          @save="updateEvent(item.eventInfo)"
        >
          <div>{{ item.eventInfo.title }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.eventInfo.title"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Description -->
      <template
        v-slot:[`item.eventInfo.description`]="{ item }"
        v-if="user.isStaff"
      >
        <v-edit-dialog
          :return-value.sync="item.eventInfo.description"
          large
          @save="updateEvent(item.eventInfo)"
        >
          <div>{{ item.eventInfo.description }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.eventInfo.description"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:[`item.dissociate`]="{ item }" v-if="user.isStaff">
        <v-btn text @click="removeProcedureStep(item)">
          <v-icon small>
            cancel
          </v-icon>
        </v-btn>
      </template>

      <template v-slot:[`item.delete`]="{ item }" v-if="user.isStaff">
        <v-btn text @click="removeEvent(item)">
          <v-icon small>
            delete
          </v-icon>
        </v-btn>
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
  props: { procedure: Object, showControls: { type: Boolean, default: true } },
  mounted() {
    if (this.user.isStaff && this.procedure) {
      this.headers.unshift(this.changeIndexColumnHeader)
      this.headers.push(this.dissociateColumnHeader)
      this.headers.push(this.deleteColumnHeader)
    }
  },
  data: () => ({
    headers: [
      { text: 'Index', value: 'index', align: 'left', width: 1 },
      { text: 'Type', value: 'eventInfo.type', width: 150 },
      { text: 'Data Model', value: 'eventInfo.modelName', width: 150 },
      { text: 'Title', value: 'eventInfo.title', width: 250 },
      { text: 'Description', value: 'eventInfo.description' }
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
    chosenIndex: -1,
    changeIndexColumnHeader: {
      text: '',
      value: 'changeIndex',
      sortable: false,
      align: 'center',
      width: 65
    },
    dissociateColumnHeader: {
      text: 'Dissociate',
      value: 'dissociate',
      sortable: false,
      align: 'center',
      width: 1
    },
    deleteColumnHeader: {
      text: 'Delete',
      value: 'delete',
      sortable: false,
      align: 'center',
      width: 1
    },
    dataModelNames: {
      django_mri: {
        session: 'MRI Session'
      }
    }
  }),
  computed: {
    ...mapState('research', [
      'dataAcquisitionModels',
      'procedureSteps',
      'procedureStepCount'
    ]),
    ...mapState('auth', ['user'])
  },
  methods: {
    getTypeDisplay(type) {
      return type == 'MeasurementDefinition' ? 'Data Acquisition' : type
    },
    getDataModelDisplay(eventInfo) {
      if (eventInfo.contentType) {
        let model = this.dataAcquisitionModels.find(
          model => model.id === eventInfo.contentType
        )
        return this.dataModelNames[model['appLabel']][model['model']]
      }
      return ''
    },
    removeEvent(procedureStep) {
      this.deleteProcedureStep(procedureStep).then(() =>
        this.deleteEvent({ id: procedureStep.event }).then(() =>
          this.$refs.controls.update()
        )
      )
    },
    removeProcedureStep(procedureStep) {
      this.deleteProcedureStep(procedureStep).then(() =>
        this.$refs.controls.update()
      )
    },
    changeIndex(item, newValue) {
      let data = { procedureStepId: item.id, index: newValue }
      this.patchProcedureStep(data)
    },
    ...mapActions('research', [
      'deleteEvent',
      'deleteProcedureStep',
      'patchProcedureStep',
      'updateEvent'
    ])
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
