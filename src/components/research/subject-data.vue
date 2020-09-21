<template>
  <v-col>
    <v-tabs v-model="active">
      <v-tab>MRI</v-tab>
      <v-tab-item>
        <br />
        <session-table :subject="subject" />
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<script>
import SessionTable from '@/components/mri/session-table.vue'

export default {
  name: 'SubjectData',
  props: {
    subject: Object
  },
  components: {
    SessionTable
  },
  data: () => ({
    active: 0
  })
}
</script>

<style scoped></style>
