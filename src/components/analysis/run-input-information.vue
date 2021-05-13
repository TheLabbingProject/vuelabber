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
      :items="inputs"
      :loading="loading"
    >
      <template v-slot:item.value="{ item }">
        <v-icon v-if="item.value == true" color="success">
          done
        </v-icon>
        <v-icon v-else-if="item.value == false" color="error">
          clear
        </v-icon>
        <div v-else>
          {{ item.value }}
        </div>
      </template>

      <template v-slot:item.preview="{ item }">
        <div v-if="['File', 'List'].includes(item.type)">
          <v-icon @click="loadPreview(item)">
            search
          </v-icon>
        </div>
      </template>

      <template v-slot:item.download="{ item }">
        <div v-if="['File', 'List'].includes(item.type)">
          <a :href="downloadInput(item)">
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
import { INPUT_REPR, INPUTS } from '@/api/analysis/endpoints.js'
import session from '@/api/session'

export default {
  name: 'RunInputInformation',
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
    this.fetchInputs(options).then(() => {
      this.loading = false
    })
  },
  computed: {
    ...mapState('analysis', ['inputs'])
  },
  methods: {
    getOutputHtml(input) {
      return `${INPUT_REPR}/${input.id}`
    },
    loadPreview(input) {
      this.showPreview = true
      this.previewMessage = 'Loading preview...'
      let url = this.getOutputHtml(input)
      session.get(url).then(({ data }) => {
        this.previewScript = data.content
        this.previewMessage = ''
      })
    },
    downloadInput(input) {
      return `${INPUTS}/${input.id}/download`
    },
    ...mapActions('analysis', ['fetchInputs'])
  },
  watch: {
    run: function(selectedRun) {
      this.loading = true
      let filters = { run: selectedRun.id }
      let pagination = {}
      let options = { filters: filters, pagination: pagination }
      this.fetchInputs(options).then(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
