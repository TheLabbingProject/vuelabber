<template>
  <div>
    <div class="title text-left pb-1">
      Runs
    </div>
    <hr />
    <run-table :loading="loading" />
  </div>
</template>

<script>
import RunTable from '@/components/analysis/run-table.vue'
import { mapActions } from 'vuex'

export default {
  name: 'RunBrowser',
  created() {
    this.loading = true
    this.fetchRuns().then(() => {
      this.loading = false
    })
  },
  components: { RunTable },
  data: () => ({
    loading: false
  }),
  methods: {
    ...mapActions('analysis', ['fetchRuns'])
  }
}
</script>

<style lang="scss" scoped></style>
