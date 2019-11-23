<template>
  <v-data-table
    item-key="id"
    :headers="headers"
    :hide-default-footer="true"
    :items="analysisVersions"
    :loading="loading"
  />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AnalysisVersionTable',
  props: { analysis: Object },
  data: () => ({
    headers: [
      { text: 'Title', value: 'title', align: 'left', width: '5%' },
      { text: 'Description', value: 'description', align: 'left' }
    ],
    loading: false
  }),
  computed: {
    analysisVersions: function() {
      return this.getAnalysisVersions(this.analysis)
    },
    ...mapGetters('analysis', ['getAnalysisVersions'])
  }
}
</script>

<style lang="scss" scoped></style>
