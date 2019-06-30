<template>
  <v-container fluid p-0>
    <upload-images />
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
import UploadImages from '@/components/dicom/upload-images.vue'

export default {
  name: 'DicomBrowser',
  components: { PatientTable, UploadImages },
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
