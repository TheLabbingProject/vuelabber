<template>
  <v-col>
    <v-tabs v-model="active">
      <!-- Studies -->
      <v-tab ripple>Studies</v-tab>
      <v-tab-item>
        <study-table />
      </v-tab-item>

      <!-- Patients -->
      <v-tab ripple>Patients</v-tab>
      <v-tab-item>
        <patient-table />
      </v-tab-item>

      <!-- Series -->
      <v-tab ripple>Series</v-tab>
      <v-tab-item>
        <series-table />
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<script>
import PatientTable from '@/components/dicom/patient-table.vue'
import SeriesTable from '@/components/dicom/series-table.vue'
import StudyTable from '@/components/dicom/study-table.vue'
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'DicomBrowser',
  components: { PatientTable, SeriesTable, StudyTable },
  data: () => ({
    active: null
  }),
  methods: {
    next() {
      let active = parseInt(this.active)
      this.active = active < 2 ? active + 1 : 0
    },
    ...mapMutations('dicom', ['setSelectedPatientId', 'setSelectedStudyId']),
    ...mapActions('dicom', ['fetchPatients', 'fetchSeries'])
  },
  watch: {
    // This resets selections when moving between tabs, however it
    // should probably refactored in the future to operate more smoothly
    active: function(value) {
      if (value === 0) {
        this.setSelectedStudyId(null)
      } else if (value === 1) {
        this.setSelectedPatientId(null)
      } else if (value === 2) {
        this.fetchSeries({ filters: {}, options: {} })
      }
    }
  }
}
</script>

<style scoped></style>
