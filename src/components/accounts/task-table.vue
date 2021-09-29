<template>
  <div>
    <v-data-table
      dense
      item-key="id"
      :headers="headers"
      :items="tasks"
      :loading="loading"
      :options.sync="options"
      :server-items-length="taskCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <task-table-controls
          :options="options"
          @fetch-tasks-start="loading = true"
          @fetch-tasks-end="loading = false"
          ref="controls"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import TaskTableControls from '@/components/accounts/task-table-controls.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TaskTable',
  mounted() {
    if (this.adminPermissions) {
      this.headers.push(this.removeHeader)
    }
  },
  components: {
    TaskTableControls
  },
  props: ['study'],
  data: () => ({
    headers: [
      { text: 'Task ID', value: 'taskId', align: 'center' },
      { text: 'Task Name', value: 'taskName', align: 'left' },
      { text: 'Created', value: 'dateCreated', align: 'center' },
      { text: 'Completed', value: 'dateDone', align: 'center' },
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
    removeHeader: {
      text: 'Remove',
      value: 'remove',
      align: 'center',
      width: 100
    }
  }),
  computed: {
    adminPermissions: function() {
      return this.user.isSuperuser
    },
    ...mapState('accounts', ['tasks', 'taskCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    // ...mapActions('accounts', ['patchUser']),
    // ...mapActions('research', ['patchStudy'])
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
