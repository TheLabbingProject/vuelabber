<template>
  <!-- <UnreviewedDataTree /> -->
  <v-container fluid>
    <v-layout>
      <v-flex>
        <ReviewTable />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
// import UnreviewedDataTree from '@/components/dataReview/UnreviewedDataTree.vue'
import ReviewTable from '@/components/dicom/review-table.vue'

export default {
  name: 'Review',
  components: {
    ReviewTable
    // UnreviewedDataTree
  }
}
</script>
