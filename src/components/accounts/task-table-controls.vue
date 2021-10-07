<template>
  <v-row class="px-4" align="baseline">
    <v-col>
      <v-text-field
        label="ID"
        v-model="filters.taskId"
        hint="Unique task identifier"
        autofocus
      />
    </v-col>
    <v-col>
      <v-text-field
        label="Task Name"
        v-model="filters.taskName"
        hint="Name of the assigned task, usually in the format 'app.task-name'"
      />
    </v-col>
    <v-col>
      <v-text-field
        label="Worker"
        v-model="filters.worker"
        hint="Worker process identifier in the format 'worker@host'"
      />
    </v-col>
    <v-col>
      <v-select
        chips
        deletable-chips
        dense
        multiple
        :items="stateSelectOptions"
        :label="stateSelectLabel"
        v-model="filters.status"
        hint="Current task state"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

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
  props: { options: Object },
  mounted() {
    this.update()
  },
  data: () => ({
    filters: {
      taskId: '',
      taskName: '',
      status: [],
      worker: ''
    },
    stateSelectLabel: 'State',
    stateSelectOptions: STATE_SELECT_OPTIONS
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    ...mapState('accounts', ['tasks']),
    ...mapState('auth', ['user'])
  },
  methods: {
    update() {
      this.$emit('fetch-tasks-start')
      this.fetchTasks(this.query).then(() => {
        this.$emit('fetch-tasks-end')
      })
    },
    ...mapActions('accounts', ['fetchTasks'])
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
