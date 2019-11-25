<template>
  <v-data-table
    item-key="id"
    :headers="headers"
    :hide-default-footer="true"
    :items="analysisVersions"
    :loading="loading"
  >
    <template v-slot:item.inputSpecification="{ item }">
      {{ getInputSpecificationId(item) }}
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AnalysisVersionTable',
  props: { analysis: Object },
  data: () => ({
    headers: [
      { text: 'Title', value: 'title', align: 'left', width: '5%' },
      { text: 'Description', value: 'description', align: 'left' },
      {
        text: 'Input Specification',
        value: 'inputSpecification',
        align: 'center',
        width: '15%'
      }
    ],
    loading: false
  }),
  computed: {
    analysisVersions: function() {
      return this.getAnalysisVersions(this.analysis)
    },
    ...mapGetters('analysis', [
      'getAnalysisVersions',
      'getInputSpecificationByUrl'
    ])
  },
  methods: {
    getInputSpecificationId: function(analysisVersion) {
      let inputSpecification = this.getInputSpecificationByUrl(
        analysisVersion.inputSpecification
      )
      return inputSpecification ? inputSpecification.id : undefined
    }
  }
}
</script>

<style lang="scss" scoped></style>
