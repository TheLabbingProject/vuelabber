<template>
  <v-col>
    <v-tabs v-model="active">
      <v-tab>MRI</v-tab>
      <v-tab-item>
        <br />
        <scan-table :subject="subject" />
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<script>
import ScanTable from '@/components/mri/scan-table.vue'

export default {
  name: 'SubjectData',
  props: {
    subject: Object
  },
  components: {
    ScanTable
  },
  data: () => ({
    active: 0
  })
}
</script>

<style scoped></style>
