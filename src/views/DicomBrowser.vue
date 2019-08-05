<template>
  <v-container fluid p-0>
    <v-tabs v-model="active">
      <v-tab ripple>
        Patients
      </v-tab>
      <v-tab-item>
        <patient-table />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import PatientTable from '@/components/dicom/patient-table.vue'

export default {
  name: 'DicomBrowser',
  components: { PatientTable },
  data: () => ({
    active: null
  }),
  methods: {
    next() {
      const active = parseInt(this.active)
      this.active = active < 2 ? active + 1 : 0
    }
  }
}
</script>

<style lang="scss" scoped></style>
