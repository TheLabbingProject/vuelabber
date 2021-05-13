<template>
  <div>
    <div v-if="showPreview">
      {{ previewMessage }}
      <div v-html="previewScript"></div>
      <v-icon @click="showPreview = false">
        cancel
      </v-icon>
    </div>
    <v-data-table
      item-key="id"
      hide-default-footer
      :headers="headers"
      :items="outputs"
      :loading="loading"
      :options.sync="options"
      :server-items-length="totalOutputCount"
      :footer-props="{
        'items-per-page-options': itemsPerPageOptions
      }"
    >
      <template v-slot:item.preview="{ item }">
        <div v-if="['File', 'List'].includes(item.type)">
          <v-icon @click="loadPreview(item)">
            search
          </v-icon>
        </div>
      </template>

      <template v-slot:item.download="{ item }">
        <div v-if="['File', 'List'].includes(item.type)">
          <a :href="downloadOutput(item)">
            <v-icon>
              download
            </v-icon>
          </a>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { OUTPUT_REPR, OUTPUTS } from '@/api/analysis/endpoints.js'
import session from '@/api/session'

export default {
  name: 'RunOutputInformation',
  props: { run: Object },
  data: () => ({
    headers: [
      { text: 'Key', value: 'key', width: 160 },
      { text: 'Value', value: 'value' },
      { text: 'Preview', value: 'preview', align: 'center', sortable: false },
      { text: 'Download', value: 'download', align: 'center', sortable: false }
    ],
    loading: false,
    showPreview: false,
    previewMessage: '',
    previewScript: '',
    itemsPerPageOptions: [10, 25, 50, -1]
  }),
  created() {
    this.loading = true
    let filters = { run: this.run.id }
    let pagination = {}
    let options = { filters: filters, pagination: pagination }
    this.fetchOutputs(options).then(() => {
      this.loading = false
    })
  },
  computed: {
    ...mapState('analysis', ['outputs', 'totalOutputCount'])
  },
  methods: {
    getOutputHtml(output) {
      return `${OUTPUT_REPR}/${output.id}`
    },
    loadPreview(output) {
      this.showPreview = true
      this.previewMessage = 'Loading preview...'
      let url = this.getOutputHtml(output)
      session.get(url).then(({ data }) => {
        this.previewScript = data.content
        this.previewMessage = ''
      })
    },
    downloadOutput(output) {
      return `${OUTPUTS}/${output.id}/download`
    },
    ...mapActions('analysis', ['fetchOutputs'])
  },
  watch: {
    run: function(selectedRun) {
      this.loading = true
      let filters = { run: selectedRun.id }
      let pagination = {}
      let options = { filters: filters, pagination: pagination }
      this.fetchOutputs(options).then(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
