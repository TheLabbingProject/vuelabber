<template>
  <v-row class="px-4" align="baseline">
    <v-col>
      <v-text-field label="Task ID" v-model="filters.taskId" />
    </v-col>
    <v-col>
      <v-text-field
        label="Task Name"
        v-model="filters.taskName"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TaskTableControls',
  props: { options: Object },
  mounted() {
    this.update()
  },
  data: () => ({
    filters: {
      taskId: '',
      taskName: ''
    }
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
