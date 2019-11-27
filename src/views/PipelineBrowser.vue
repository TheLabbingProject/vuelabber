<template>
  <v-scale-transition hide-on-leave>
    <v-skeleton-loader v-if="!fetchedPipelines" type="table" />
    <v-col v-else>
      <div class="title text-left pb-1">
        Pipelines
      </div>
      <hr />
      <v-data-table
        item-key="id"
        show-expand
        single-expand
        :expanded.sync="expanded"
        :headers="headers"
        :items="pipelines"
        :loading="loading"
      >
        <template v-slot:item.created="{ item }">
          {{ item.created | formatDateTime }}
        </template>

        <template v-slot:item.modified="{ item }">
          {{ item.modified | formatDateTime }}
        </template>

        <template v-slot:expanded-item="{ item, headers }">
          <td class="pa-2 blue lighten-5" :colspan="headers.length">
            <pipeline-flowchart :pipeline="item" />
          </td>
        </template>
      </v-data-table>
    </v-col>
  </v-scale-transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PipelineFlowchart from '@/components/analysis/pipeline-flowchart.vue'

export default {
  name: 'PipelineBrowser',
  components: { PipelineFlowchart },
  created() {
    this.fetchAnalyses()
    this.fetchPipelines()
    this.fetchedPipelines = true
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Created', value: 'created', align: 'center' },
      { text: 'Modified', value: 'modified', align: 'center' }
    ],
    loading: false,
    fetchedPipelines: false
  }),
  computed: {
    ...mapState('analysis', ['pipelines'])
  },
  methods: {
    ...mapActions('analysis', [
      'fetchAnalyses',
      'fetchAnalysisVersions',
      'fetchInputDefinitions',
      'fetchNodes',
      'fetchOutputDefinitions',
      'fetchPipelines'
    ])
  }
}
</script>

<style lang="scss" scoped></style>
