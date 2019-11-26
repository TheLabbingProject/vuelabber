<template>
  <v-scale-transition hide-on-leave>
    <v-skeleton-loader v-if="!fetchedData" type="table" />
    <v-col v-else>
      <div class="title text-left pb-1">
        Analyses
      </div>
      <hr />
      <category-table />
    </v-col>
  </v-scale-transition>
</template>

<script>
import categoryTable from '@/components/analysis/category-table.vue'
import { mapActions } from 'vuex'

export default {
  name: 'AnalysisBrowser',
  components: { categoryTable },
  created() {
    this.fetchCategories()
    this.fetchAnalyses()
    this.fetchAnalysisVersions().then(() => (this.fetchedData = true))
  },
  data: () => ({
    fetchedData: false
  }),
  methods: {
    ...mapActions('analysis', [
      'fetchAnalyses',
      'fetchAnalysisVersions',
      'fetchCategories'
    ])
  }
}
</script>

<style lang="scss" scoped></style>
