<template>
  <!-- <UnreviewedDataTree /> -->
  <v-container fluid>
    <v-layout row wrap>
      <v-flex>
        <patient-table />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import PatientTable from '@/components/dicom/patient-table.vue'

export default {
  name: 'Review',
  components: {
    PatientTable
  }
}
</script>
