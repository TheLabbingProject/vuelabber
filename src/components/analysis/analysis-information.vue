<template>
  <v-scale-transition hide-on-leave>
    <v-skeleton-loader v-if="!analysis" type="article, actions" />
    <div v-else class="text-left">
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
          <analysis-version-table :analysis="analysis" />
        </v-tab-item>
        <v-tab key="inputSpecifications">
          Input Specifications
        </v-tab>
        <v-tab-item key="inputSpecifications">
          <input-specification-table :analysis="analysis" />
        </v-tab-item>
        <v-tab key="outputSpecifications">
          Output Specifications
        </v-tab>
        <v-tab-item key="outputSpecifications">
          Three
        </v-tab-item>
      </v-tabs>
    </div>
  </v-scale-transition>
</template>

<script>
import AnalysisVersionTable from '@/components/analysis/analysis-version-table.vue'
import InputSpecificationTable from '@/components/analysis/input_specification_table.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AnalysisInformation',
  components: { AnalysisVersionTable, InputSpecificationTable },
  props: { analysisId: String },
  data: () => ({
    tab: null
  }),
  computed: {
    analysis: function() {
      return this.getAnalysisById(Number(this.analysisId))
    },
    ...mapGetters('analysis', ['getAnalysisById'])
  },
  created() {
    this.fetchCategories()
    this.fetchAnalyses()
    this.fetchAnalysisVersions()
    this.fetchInputSpecifications()
  },
  methods: {
    ...mapActions('analysis', [
      'fetchAnalyses',
      'fetchAnalysisVersions',
      'fetchCategories',
      'fetchInputSpecifications'
    ])
  }
}
</script>

<style lang="scss" scoped></style>
