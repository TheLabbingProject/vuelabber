<template>
  <div>
    <div v-if="showPreview">
      {{ previewMessage }}
      <div v-html="previewScript"></div>
      <v-icon @click="showPreview = false">
        cancel
      </v-icon>
    </div>
    <run-input-controls
      :run="run"
      :options="options"
      @fetch-inputs-start="loading = true"
      @fetch-inputs-end="loading = false"
    />
    <v-data-table
      item-key="id"
      :headers="headers"
      :items="inputs"
      :loading="loading"
      :options.sync="options"
      :server-items-length="inputCount"
      :footer-props="{
        'items-per-page-options': itemsPerPageOptions
      }"
    >
      <template v-slot:item.value="{ item }">
        <v-icon v-if="item.value == true" color="success">
          done
        </v-icon>
        <v-icon v-else-if="item.value == false" color="error">
          clear
        </v-icon>
        <div v-else-if="item.type == 'File'">
          {{ getFileName(item.value) }}
        </div>
        <div v-else-if="item.type == 'List[File]'">
          <v-data-table
            item-key="index"
            dense
            hide-default-header
            hide-default-footer
            :headers="[{ text: 'File Name', value: 'fileName', align: 'left' }]"
            :items="generateFileListItems(item)"
          />
        </div>
        <div v-else>
          {{ item.value }}
        </div>
      </template>

      <template v-slot:item.preview="{ item }">
        <div v-if="['File'].includes(item.type)">
          <v-icon @click="loadPreview(item)">
            search
          </v-icon>
        </div>
        <div v-else-if="['List[File]'].includes(item.type)">
          <v-data-table
            item-key="index"
            dense
            hide-default-header
            hide-default-footer
            :headers="[{ text: 'Preview', value: 'preview', align: 'center' }]"
            :items="generateFileListItems(item)"
          >
            <template v-slot:item.preview="{ item }">
              <v-icon @click="loadPreview(item, item.index)">
                search
              </v-icon>
            </template>
          </v-data-table>
        </div>
      </template>

      <template v-slot:item.download="{ item }">
        <div v-if="['File', 'List[File]'].includes(item.type)">
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
import { mapState } from 'vuex'
import { INPUT_REPR, INPUTS } from '@/api/analysis/endpoints.js'
import session from '@/api/session'
import RunInputControls from '@/components/analysis/run-input-controls.vue'

export default {
  name: 'RunInputInformation',
  props: { run: Object },
  components: { RunInputControls },
  data: () => ({
    headers: [
      { text: 'Key', value: 'key', width: 160 },
      { text: 'Type', value: 'type', width: 160 },
      { text: 'Value', value: 'value' },
      { text: 'Preview', value: 'preview', align: 'center', sortable: false },
      { text: 'Download', value: 'download', align: 'center', sortable: false }
    ],
    loading: false,
    showPreview: false,
    previewMessage: '',
    previewScript: '',
    itemsPerPageOptions: [5, 10, 25, 50, -1],
    options: {
      page: 1,
      sortBy: ['key'],
      sortDesc: [false],
      itemsPerPage: 10
    }
  }),
  computed: {
    ...mapState('analysis', ['inputs', 'inputCount'])
  },
  methods: {
    getPreviewHtml(input, index) {
      let baseUrl = `${INPUT_REPR}/${input.id}`
      return index == undefined ? baseUrl : `${baseUrl}/${index}`
    },
    loadPreview(input, index) {
      this.showPreview = true
      this.previewMessage = 'Loading preview...'
      let url = this.getPreviewHtml(input, index)
      session.get(url).then(({ data }) => {
        this.previewScript = data.content
        this.previewMessage = ''
      })
    },
    downloadInput(input) {
      return `${INPUTS}/${input.id}/download`
    },
    getFileName(path) {
      return path.split('/').splice(-1)[0]
    },
    generateFileListItems(item) {
      return item.value.map((path, index) => {
        return { id: item.id, index: index, fileName: this.getFileName(path) }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
