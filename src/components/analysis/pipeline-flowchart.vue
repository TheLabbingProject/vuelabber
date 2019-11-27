<template>
  <vue-mermaid :nodes="flowChart(pipeline)" type="graph TD" />
</template>

<script>
export default {
  name: 'PipelineFlowchart',
  props: { pipeline: Object },
  data: () => ({
    ready: true
  }),
  methods: {
    getNodeRepresentation(node) {
      let analysisTitle = node.analysisVersion.analysis.title
      let analysisVersionTitle = node.analysisVersion.title
      return `${analysisTitle} v${analysisVersionTitle}`
    },
    getNodeByUrl(url) {
      return this.pipeline.nodeSet.find(node => node.url === url)
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
        let source = this.getNodeByUrl(pipe.source)
        let destination = this.getNodeByUrl(pipe.destination)
        let sourceBlockId = this.composePipeId(source, pipe.sourcePort)
        let destinationBlockId = this.composePipeId(
          destination,
          pipe.destinationPort
        )
        configurations.push(
          {
            id: sourceBlockId,
            text: pipe.sourcePort.key,
            group: this.getNodeRepresentation(source),
            next: [destinationBlockId]
          },
          {
            id: destinationBlockId,
            text: pipe.destinationPort.key,
            group: this.getNodeRepresentation(destination)
          }
        )
      })
      return configurations
    }
  }
}
</script>

<style lang="scss" scoped></style>
