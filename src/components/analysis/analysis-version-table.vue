<template>
  <v-data-table
    item-key="id"
    :headers="headers"
    :hide-default-footer="true"
    :items="analysisVersions"
    :loading="loading"
  >
    <template v-slot:item.inputSpecification="{ item }">
      <a @click="goToInputSpecification(item.inputSpecification)">
        {{ getInputSpecificationId(item) }}
      </a>
    </template>

    <template v-slot:item.outputSpecification="{ item }">
      <a @click="goToOutputSpecification(item.outputSpecification)">
        {{ getOutputSpecificationId(item) }}
      </a>
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
      },
      {
        text: 'Output Specification',
        value: 'outputSpecification',
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
      'getInputSpecificationByUrl',
      'getOutputSpecificationByUrl'
    ])
  },
  methods: {
    getInputSpecificationId: function(analysisVersion) {
      let inputSpecification = this.getInputSpecificationByUrl(
        analysisVersion.inputSpecification
      )
      return inputSpecification ? inputSpecification.id : undefined
    },
    getOutputSpecificationId: function(analysisVersion) {
      let outputSpecification = this.getOutputSpecificationByUrl(
        analysisVersion.outputSpecification
      )
      return outputSpecification ? outputSpecification.id : undefined
    },
    goToInputSpecification: function(inputSpecificationUrl) {
      this.$emit('goToInputSpecification', inputSpecificationUrl)
    },
    goToOutputSpecification: function(outputSpecificationUrl) {
      this.$emit('goToOutputSpecification', outputSpecificationUrl)
    }
  }
}
</script>

<style lang="scss" scoped></style>
