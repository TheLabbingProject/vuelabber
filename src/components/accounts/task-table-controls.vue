<template>
  <v-row class="px-4" align="baseline">
    <v-col>
      <v-text-field
        v-model="taskIdFilter.value"
        autofocus
        :label="taskIdFilter.label"
        :hint="taskIdFilter.hint"
      />
    </v-col>
    <v-col>
      <v-text-field
        v-model="taskNameFilter.value"
        :hint="taskNameFilter.hint"
        :label="taskNameFilter.label"
      />
    </v-col>
    <v-col>
      <v-text-field
        v-model="workerFilter.value"
        :hint="workerFilter.hint"
        :label="workerFilter.label"
      />
    </v-col>
    <v-col>
      <v-select
        v-model="statusFilter.value"
        chips
        deletable-chips
        dense
        multiple
        :hint="statusFilter.hint"
        :items="stateSelectOptions"
        :label="statusFilter.label"
      />
    </v-col>
    <v-col :cols="1" v-if="showDeleteButton">
      <v-btn
        color="error"
        :disabled="disableDeleteButton"
        @click="deleteSelectedTasks"
      >
        Delete
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { camelToSnake } from '@/utils'

const STATE_SELECT_OPTIONS = [
  { text: 'Started', value: 'STARTED' },
  { text: 'Success', value: 'SUCCESS' },
  { text: 'Failure', value: 'FAILURE' },
  { text: 'Pending', value: 'Pending' },
  { text: 'Received', value: 'RECEIVED' },
  { text: 'Retry', value: 'RETRY' },
  { text: 'Revoked', value: 'REVOKED' }
]

export default {
  name: 'TaskTableControls',
  props: { options: Object, selectedTasks: Array, parent: Object },
  mounted() {
    this.update()
  },
  data: () => ({
    taskIdFilter: { label: 'ID', hint: 'Unique task identifier', value: '' },
    taskNameFilter: {
      label: 'Task Name',
      hint: "Name of the assigned task, usually in the format 'app.task-name'",
      value: ''
    },
    workerFilter: {
      label: 'Worker',
      hint: "Worker process identifier in the format 'worker@host'",
      value: ''
    },
    statusFilter: { label: 'Status', hint: '', value: [] },
    stateSelectLabel: 'Status',
    stateSelectOptions: STATE_SELECT_OPTIONS
  }),
  computed: {
    filters: function() {
      return {
        taskId: this.taskIdFilter.value,
        taskName: this.taskNameFilter.value,
        status: this.statusFilter.value,
        worker: this.workerFilter.value,
        parent: this.parent.taskId
      }
    },
    query: function() {
      let options = Object.assign({}, this.options)
      options.sortBy = options.sortBy.map(field => camelToSnake(field))
      return { filters: this.filters, options }
    },
    showDeleteButton: function() {
      return this.user.isSuperuser
    },
    disableDeleteButton: function() {
      return !this.selectedTasks.length
    },
    ...mapState('auth', ['user'])
  },
  methods: {
    update() {
      this.$emit('fetch-tasks-start')
      this.fetchTasks(this.query).then(() => {
        this.$emit('fetch-tasks-end')
      })
    },
    deleteSelectedTasks() {
      this.$emit('task-delete-start')
      let promises = this.selectedTasks.map(task => this.deleteTask(task))
      Promise.all(promises)
        .then(() => this.$emit('task-delete-end'))
        .catch(console.log)
    },
    ...mapActions('accounts', ['deleteTask', 'fetchTasks'])
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
