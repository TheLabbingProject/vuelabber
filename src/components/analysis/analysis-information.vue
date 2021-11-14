<template>
  <div>
    <div v-if="analysis" class="text-left">
      <div class="title pb-1">
        {{ analysis.title }}
      </div>
      <hr />
      <div class="py-3">
        <div v-if="analysis.description">
          {{ analysis.description }}
        </div>
        <div v-else>
          No description provided.
        </div>
      </div>

      <v-tabs
        v-model="tab"
        background-color="deep-purple accent-4"
        class="elevation-2"
        centered
        dark
        grow
      >
        <v-tabs-slider />
        <v-tab key="versions">
          Versions
        </v-tab>
        <v-tab-item key="versions">
          <analysis-version-table
            :analysis="analysis"
            @goToInputSpecification="goToInputSpecification"
            @goToOutputSpecification="goToOutputSpecification"
          />
        </v-tab-item>
        <v-tab key="inputSpecifications">
          Input Specifications
        </v-tab>
        <v-tab-item key="inputSpecifications">
          <input-specification-table
            :analysis="analysis"
            :expandedInputSpecificationId="chosenInputSpecificationId"
          />
        </v-tab-item>
        <v-tab key="outputSpecifications">
          Output Specifications
        </v-tab>
        <v-tab-item key="outputSpecifications">
          <output-specification-table
            :analysis="analysis"
            :expandedOutputSpecificationId="chosenOutputSpecificationId"
          />
        </v-tab-item>
      </v-tabs>
    </div>
    <div v-else>
      Invalid analysis ID!
    </div>
  </div>
</template>

<script>
import AnalysisVersionTable from '@/components/analysis/analysis-version-table.vue'
import InputSpecificationTable from '@/components/analysis/input-specification-table.vue'
import OutputSpecificationTable from '@/components/analysis/output-specification-table.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AnalysisInformation',
  components: {
    AnalysisVersionTable,
    InputSpecificationTable,
    OutputSpecificationTable
  },
  props: { analysisId: [String, Number] },
  created() {
    let filters = { analysis: [this.analysisId] }
    let options = { filters: filters, pagination: {} }
    this.fetchAnalysisVersions({ filters, options: {} })
    this.fetchInputSpecifications(options)
    this.fetchOutputSpecifications(options)
  },

  data: () => ({
    tab: null,
    chosenInputSpecificationId: null,
    chosenOutputSpecificationId: null
  }),
  computed: {
    analysis: function() {
      return this.getAnalysisById(Number(this.analysisId))
    },
    ...mapGetters('analysis', ['getAnalysisById'])
  },
  methods: {
    goToInputSpecification: function(inputSpecificationId) {
      this.tab = 1
      this.chosenInputSpecificationId = inputSpecificationId
    },
    goToOutputSpecification: function(outputSpecificationId) {
      this.tab = 2
      this.chosenOutputSpecificationId = outputSpecificationId
    },
    ...mapActions('analysis', [
      'fetchAnalyses',
      'fetchAnalysisVersions',
      'fetchInputSpecifications',
      'fetchOutputSpecifications'
    ])
  },
  watch: {
    tab: function(selectedTab) {
      if (selectedTab != 1) {
        this.chosenInputSpecificationId = null
      }
      if (selectedTab != 2) {
        this.chosenOutputSpecificationId = null
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
