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
            <vue-mermaid :nodes="flowChart(item)" type="graph LR" />
          </td>
        </template>
      </v-data-table>
    </v-col>
  </v-scale-transition>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'PipelineBrowser',
  created() {
    this.fetchAnalyses()
    this.fetchAnalysisVersions()
    this.fetchInputDefinitions({ filters: {}, pagination: {} })
      .then(() =>
        this.fetchOutputDefinitions({
          filters: {},
          pagination: { itemsPerPage: 100 }
        })
      )
      .then(() => this.fetchNodes())
      .then(() =>
        this.fetchPipelines().then(() => (this.fetchedPipelines = true))
      )
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
    getSourceText: function(pipe) {
      let sourcePortId = pipe.sourcePort.split('/')
      sourcePortId = Number(sourcePortId[sourcePortId.length - 2])
      let sourcePort = this.getOutputDefinitionById(sourcePortId)
      return sourcePort.key
    },
    getDestinationText: function(pipe) {
      let destinationPortId = pipe.destinationPort.split('/')
      destinationPortId = Number(
        destinationPortId[destinationPortId.length - 2]
      )
      let destinationPort = this.getInputDefinitionById(destinationPortId)
      return destinationPort.key
    },
    getSourceNodeRepresentation: function(pipe) {
      let sourceNode = this.getNodeByUrl(pipe.source)
      let analysisVersion = this.getAnalysisVersionByUrl(
        sourceNode.analysisVersion
      )
      let analysis = this.getAnalysisByUrl(analysisVersion.analysis)
      return `${analysis.title} v${analysisVersion.title}`
    },
    getDestinationNodeRepresentation: function(pipe) {
      let destinationNode = this.getNodeByUrl(pipe.destination)
      let analysisVersion = this.getAnalysisVersionByUrl(
        destinationNode.analysisVersion
      )
      let analysis = this.getAnalysisByUrl(analysisVersion.analysis)
      return `${analysis.title} v${analysisVersion.title}`
    },
    // getText: function(node) {
    //   let analysisVersion = this.getAnalysisVersionByUrl(node.analysisVersion)
    //   let analysis = this.getAnalysisByUrl(analysisVersion.analysis)
    //   let configuration = ''
    //   Object.keys(node.configuration).forEach(
    //     key => (configuration += `<br/>${key}: ${node.configuration[key]}`)
    //   )
    //   return `${analysis.title} v${analysisVersion.title} ${configuration}`
    // },
    // getNext: function(pipeline, node) {
    //   return pipeline.pipeSet
    //     .filter(pipe => pipe.source === node.url)
    //     .map(pipe => this.getNodeByUrl(pipe.destination).id)
    // },
    flowChart: function(pipeline) {
      let configurations = []
      pipeline.pipeSet.forEach(pipe => {
        let source = {
          id: `${pipe.id}0`,
          text: this.getSourceText(pipe),
          group: this.getSourceNodeRepresentation(pipe),
          next: [`${pipe.id}1`]
        }
        let destination = {
          id: `${pipe.id}1`,
          text: this.getDestinationText(pipe),
          group: this.getDestinationNodeRepresentation(pipe)
        }
        configurations = [...configurations, source, destination]
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
