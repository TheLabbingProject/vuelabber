<template>
  <v-col>
    <v-tabs v-model="active">
      <v-tab>Collaborators</v-tab>
      <v-tab-item>
        <user-table :study="study" />
      </v-tab-item>
      <v-tab>Procedures</v-tab>
      <v-tab-item>
        <procedure-table :study="study" />
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<script>
import UserTable from '@/components/accounts/user-table.vue'
import ProcedureTable from '@/components/research/procedure-table.vue'

export default {
  name: 'StudyInfo',
  props: {
    study: Object
  },
  components: { ProcedureTable, UserTable },
  data: () => ({
    active: 0
  })
}
</script>

<style scoped></style>
