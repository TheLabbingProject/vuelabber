<template>
  <div>
    <div v-if="showPreview">
      {{ previewMessage }}
      <div v-html="previewScript"></div>
      <v-icon @click="showPreview = false">
        cancel
      </v-icon>
    </div>
    <run-output-controls
      :run="run"
      :options="options"
      @fetch-outputs-start="loading = true"
      @fetch-outputs-end="loading = false"
    />
    <v-data-table
      item-key="id"
      dense
      :headers="headers"
      :items="outputs"
      :loading="loading"
      :options.sync="options"
      :server-items-length="outputCount"
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
            :headers="listHeaders"
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
import { mapState } from 'vuex'
import { OUTPUT_REPR, OUTPUTS } from '@/api/analysis/endpoints.js'
import session from '@/api/session'
import RunOutputControls from '@/components/analysis/run-output-controls.vue'

export default {
  name: 'RunOutputInformation',
  props: { run: Object },
  components: { RunOutputControls },
  data: () => ({
    headers: [
      { text: 'Key', value: 'key', width: 160 },
      { text: 'Type', value: 'type' },
      { text: 'Value', value: 'value' },
      { text: 'Preview', value: 'preview', align: 'center', sortable: false },
      { text: 'Download', value: 'download', align: 'center', sortable: false }
    ],
    listHeaders: [
      {
        text: 'File Name',
        value: 'fileName',
        align: 'left'
      }
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
    ...mapState('analysis', ['outputs', 'outputCount'])
  },
  methods: {
    getOutputHtml(output, index) {
      let baseUrl = `${OUTPUT_REPR}/${output.id}`
      return index == undefined ? baseUrl : `${baseUrl}/${index}`
    },
    loadPreview(output, index) {
      this.showPreview = true
      this.previewMessage = 'Loading preview...'
      let url = this.getOutputHtml(output, index)
      session.get(url).then(({ data }) => {
        this.previewScript = data.content
        this.previewMessage = ''
      })
    },
    downloadOutput(output, index) {
      let baseUrl = `${OUTPUTS}/${output.id}/download/`
      return index == undefined ? baseUrl : `${baseUrl}/${index}`
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
