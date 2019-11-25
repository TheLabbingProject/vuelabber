<template>
  <v-scale-transition hide-on-leave>
    <v-skeleton-loader
      v-if="fetchedAnalyses === false"
      type="article, actions"
    />
    <div v-else>
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
      <div v-else>
        Invalid analysis ID!
      </div>
    </div>
  </v-scale-transition>
</template>

<script>
import AnalysisVersionTable from '@/components/analysis/analysis-version-table.vue'
import InputSpecificationTable from '@/components/analysis/input-specification-table.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AnalysisInformation',
  components: { AnalysisVersionTable, InputSpecificationTable },
  props: { analysisId: String },
  created() {
    console.log(this.analysis)
    this.fetchCategories()
    this.fetchAnalyses().then(() => (this.fetchedAnalyses = true))
    this.fetchAnalysisVersions()
    this.fetchInputSpecifications()
  },

  data: () => ({
    tab: null,
    fetchedAnalyses: false
  }),
  computed: {
    analysis: function() {
      return this.getAnalysisById(Number(this.analysisId))
    },
    ...mapGetters('analysis', ['getAnalysisById'])
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
