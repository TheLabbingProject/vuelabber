<template>
  <v-row class="px-4 justify-space-between align-center">
    <v-col :cols="3">
      <v-text-field label="Title" v-model="filters.title" />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'AnalysisTableControls',
  props: { options: Object },
  created() {
    this.update()
  },
  data: () => ({
    filters: {
      title: ''
    }
  }),
  methods: {
    update() {
      this.$emit('fetch-analysis-start')
      let query = { filters: this.filters, options: this.options }
      this.fetchAnalyses(query).then(() => {
        this.$emit('fetch-analysis-end')
      })
    },
    ...mapActions('analysis', ['fetchAnalyses'])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    options: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
