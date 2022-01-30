<template>
  <v-container fluid>
    <v-tabs v-model="active">
      <v-tab>
        {{ mriTabTitle }}
      </v-tab>
      <v-tab-item>
        <session-table
          :subject="subject"
          :studyFilter="studyFilter"
          :procedureFilter="procedureFilter"
          :acquisitionFilter="acquisitionFilter"
          :groupFilter="groupFilter"
        />
      </v-tab-item>
      <v-tab>
        {{ runsTabTitle }}
      </v-tab>
      <v-tab-item>
        <run-table :subject="subject" />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import SessionTable from '@/components/mri/session-table.vue'
import RunTable from '@/components/analysis/run-table.vue'

export default {
  name: 'SubjectData',
  props: {
    subject: Object,
    studyFilter: Array,
    procedureFilter: Array,
    acquisitionFilter: Array,
    groupFilter: Array
  },
  components: {
    RunTable,
    SessionTable
  },
  data: () => ({
    active: 0,
    mriTabTitle: 'MRI',
    runsTabTitle: 'Runs'
  })
}
</script>

<style scoped></style>
