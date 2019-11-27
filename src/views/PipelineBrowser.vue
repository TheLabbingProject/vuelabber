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
            <vue-mermaid :nodes="flowChart(item)" type="graph TD" />
          </td>
        </template>
      </v-data-table>
    </v-col>
  </v-scale-transition>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { urlToId } from '@/api/utils'

export default {
  name: 'PipelineBrowser',
  created() {
    this.fetchAnalyses()
    this.fetchAnalysisVersions()
    this.fetchInputDefinitions({ filters: {}, pagination: {} })
    this.fetchOutputDefinitions({ filters: {}, pagination: {} })
    this.fetchNodes()
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
    ...mapGetters('analysis', [
      'getAnalysisByUrl',
      'getAnalysisVersionByUrl',
      'getNodeByUrl',
      'getInputDefinitionById',
      'getOutputDefinitionById'
    ]),
    ...mapState('analysis', ['pipelines', 'outputDefinitions'])
  },
  methods: {
    getNodeRepresentation(node) {
      let analysisVersion = this.getAnalysisVersionByUrl(node.analysisVersion)
      let analysis = this.getAnalysisByUrl(analysisVersion.analysis)
      return `${analysis.title} v${analysisVersion.title}`
    },
    getPipeComponents(pipe) {
      let sourceNode = this.getNodeByUrl(pipe.source)
      let destinationNode = this.getNodeByUrl(pipe.destination)
      let sourcePortId = urlToId(pipe.sourcePort)
      let sourcePort = this.getOutputDefinitionById(sourcePortId)
      let destinationPortId = urlToId(pipe.destinationPort)
      let destinationPort = this.getInputDefinitionById(destinationPortId)
      return [sourceNode, sourcePort, destinationNode, destinationPort]
    },
    composePipeId(node, port) {
      return `${node.id}-${port.key}`
    },
    composeConfigurationId(node) {
      return `${node.id}-config`
    },
    textifyConfiguration(configuration) {
      let text = ''
      for (let [key, value] of Object.entries(configuration)) {
        text += `${key}: ${value}<br>`
      }
      return text
    },
    flowChart: function(pipeline) {
      let configurations = []
      pipeline.nodeSet.forEach(node =>
        configurations.push({
          id: this.composeConfigurationId(node),
          text: this.textifyConfiguration(node.configuration),
          group: this.getNodeRepresentation(node),
          style: 'fill:#f9f,stroke:#333,stroke-width:1px,text-align:left',
          edgeType: 'round'
        })
      )
      pipeline.pipeSet.forEach(pipe => {
        let [
          sourceNode,
          sourcePort,
          destinationNode,
          destinationPort
        ] = this.getPipeComponents(pipe)
        let sourceBlockId = this.composePipeId(sourceNode, sourcePort)
        let destinationBlockId = this.composePipeId(
          destinationNode,
          destinationPort
        )
        configurations.push(
          {
            id: sourceBlockId,
            text: sourcePort.key,
            group: this.getNodeRepresentation(sourceNode),
            next: [destinationBlockId]
          },
          {
            id: destinationBlockId,
            text: destinationPort.key,
            group: this.getNodeRepresentation(destinationNode)
          }
        )
      })
      return configurations
    },
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
