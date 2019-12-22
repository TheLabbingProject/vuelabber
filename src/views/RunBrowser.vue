<template>
  <v-scale-transition hide-on-leave>
    <v-skeleton-loader v-if="!fetchedRuns" type="table" />
    <v-col v-else>
      <div class="title text-left pb-1">
        Runs
      </div>
      <hr />
      <run-table />
    </v-col>
  </v-scale-transition>
</template>

<script>
import RunTable from '@/components/analysis/run-table.vue'
import { mapActions } from 'vuex'

export default {
  name: 'RunBrowser',
  created() {
    this.loading = true
    this.fetchUsers({ filters: {}, pagination: {} })
    this.fetchAnalyses()
    this.fetchAnalysisVersions()
    this.fetchRuns().then(() => (this.fetchedRuns = true))
    this.loading = false
  },
  components: { RunTable },
  data: () => ({
    fetchedRuns: false
  }),
  methods: {
    ...mapActions('accounts', ['fetchUsers']),
    ...mapActions('analysis', [
      'fetchAnalyses',
      'fetchAnalysisVersions',
      'fetchRuns'
    ])
  }
}
</script>

<style lang="scss" scoped></style>
