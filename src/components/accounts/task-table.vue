<template>
  <div>
    <v-data-table
      dense
      item-key="id"
      show-expand
      v-model="selectedTasks"
      ref="taskTable"
      multi-sort
      :headers="headers"
      :items="tasks"
      :loading="loading"
      :options.sync="options"
      :server-items-length="taskCount"
      :expanded.sync="expanded"
      :footer-props="{
        itemsPerPageOptions
      }"
      :show-select="this.user.isSuperuser"
    >
      <template v-slot:top>
        <task-table-controls
          :options="options"
          :selectedTasks="selectedTasks"
          @fetch-tasks-start="loading = true"
          @fetch-tasks-end="loading = false"
          @task-delete-end="handleTaskDeletion"
          ref="controls"
        />
      </template>

      <!-- Created -->
      <template v-slot:[`item.dateCreated`]="{ item }">
        {{ item.dateCreated | formatDateTime }}
      </template>

      <!-- Completed -->
      <template v-slot:[`item.dateDone`]="{ item }">
        {{ item.dateDone | formatDateTime }}
      </template>

      <!-- Duration -->
      <template v-slot:[`item.duration`]="{ item }">
        {{ calculateDuration(item) }}
      </template>

      <!-- Status -->
      <template v-slot:[`item.status`]="{ item }">
        <v-icon small :color="getStatusColor(item.status)">
          circle
        </v-icon>
      </template>

      <!-- Status -->
      <template v-slot:[`item.remove`]="{ item }">
        <v-icon small @click="deleteTask(item)">
          delete
        </v-icon>
      </template>

      <!-- Expanded Information -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="pa-0 ma-0">
          <task-info :task="item" />
        </td>
      </template>
    </v-data-table>
    <v-snackbar v-model="deleteSnackbar" :timeout="deleteSnackbarTimeout">
      {{ deleteSnackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="deleteSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import TaskTableControls from '@/components/accounts/task-table-controls.vue'
import TaskInfo from '@/components/accounts/task-info.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TaskTable',
  components: {
    TaskTableControls,
    TaskInfo
  },
  props: ['study'],
  data: () => ({
    headers: [
      { text: 'Task ID', value: 'taskId', align: 'center' },
      { text: 'Task Name', value: 'taskName', align: 'left' },
      { text: 'Worker', value: 'worker', align: 'center' },
      { text: 'Created', value: 'dateCreated', align: 'center' },
      { text: 'Completed', value: 'dateDone', align: 'center' },
      {
        text: 'Duration',
        value: 'duration',
        align: 'center',
        sortable: false
      },
      { text: 'Status', value: 'status', align: 'center' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['dateCreated'],
      sortDesc: [true]
    },
    itemsPerPageOptions: [10, 25, 50, 100],
    loading: false,
    expanded: [],
    expand: true,
    statusOptions: [
      'FAILURE',
      'PENDING',
      'RECEIVED',
      'RETRY',
      'REVOKED',
      'STARTED',
      'SUCCESS'
    ],
    statusColors: ['red', 'grey', 'yellow', 'yellow', 'red', 'orange', 'green'],
    selectedTasks: [],
    deleteSnackbar: false,
    deleteSnackbarTimeout: 2500,
    deleteSnackbarText: ''
  }),
  computed: {
    adminPermissions: function() {
      return this.user.isSuperuser
    },
    ...mapState('accounts', ['tasks', 'taskCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    getStatusColor: function(status) {
      return this.statusColors[this.statusOptions.indexOf(status)]
    },
    calculateDuration(taskResult) {
      let started = new Date(taskResult.dateCreated)
      let finished = new Date(taskResult.dateDone)
      let seconds = finished - started
      return new Date(seconds).toISOString().substr(11, 8)
    },
    showDeleteSnackbar() {
      let nDeleted = this.selectedTasks.length
      let taskText = 'task' + (nDeleted > 1 ? 's' : '')
      this.deleteSnackbarText = `${nDeleted} ${taskText} successfully deleted`
      this.deleteSnackbar = true
    },
    handleTaskDeletion() {
      this.showDeleteSnackbar()
      this.selectedTasks = []
      this.$refs.controls.update()
    },
    ...mapActions('accounts', { deleteTaskAction: 'deleteTask' })
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.user-info {
  background-color: #dfe9fd;
}
</style>
