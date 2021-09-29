<template>
  <v-col>
    <task-table />
  </v-col>
</template>

<script>
import TaskTable from '@/components/accounts/task-table.vue'

export default {
  name: 'TaskBrowser',
  components: { TaskTable }
}
</script>

<style scoped></style>
