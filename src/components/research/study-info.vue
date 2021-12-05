<template>
  <v-col>
    <v-tabs v-model="active">
      <v-tab>
        {{ collaboratorsTabTitle }}
      </v-tab>
      <v-tab-item>
        <user-table :study="study" />
      </v-tab-item>
      <v-tab>
        {{ proceduresTabTitle }}
      </v-tab>
      <v-tab-item>
        <procedure-table :study="study" />
      </v-tab-item>
      <v-tab>
        {{ groupsTabTitle }}
      </v-tab>
      <v-tab-item>
        <group-table :study="study" />
      </v-tab-item>
      <v-tab>
        {{ subjectsTabTitle }}
      </v-tab>
      <v-tab-item>
        <subject-table :study="study" />
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<script>
import UserTable from '@/components/accounts/user-table.vue'
import ProcedureTable from '@/components/research/procedure-table.vue'
import GroupTable from '@/components/research/group-table.vue'
import SubjectTable from '@/components/research/subject-table.vue'

export default {
  name: 'StudyInfo',
  props: {
    study: Object
  },
  components: { GroupTable, ProcedureTable, SubjectTable, UserTable },
  data: () => ({
    active: 0,
    collaboratorsTabTitle: 'Collaborators',
    proceduresTabTitle: 'Procedures',
    groupsTabTitle: 'Groups',
    subjectsTabTitle: 'Subjects'
  })
}
</script>

<style scoped></style>
