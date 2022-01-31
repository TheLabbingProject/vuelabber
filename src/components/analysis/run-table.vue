<template>
  <v-container fluid>
    <v-col class="pa-0">
      <v-data-table
        item-key="id"
        show-expand
        single-expand
        show-select
        multi-sort
        dense
        v-model="selectedRuns"
        :expanded.sync="expanded"
        :headers="headers"
        :items="runs"
        :loading="loading"
        :options.sync="options"
        :server-items-length="runCount"
        :footer-props="{
          itemsPerPageOptions
        }"
      >
        <template v-slot:top>
          <run-table-controls
            ref="controls"
            :options="options"
            :scan="scan"
            :subject="subject"
            :selectedRuns="selectedRuns"
            @fetch-run-start="loading = true"
            @fetch-run-end="loading = false"
          ></run-table-controls>
        </template>
        <template v-slot:item.analysis="{ item }">
          <router-link
            class="nav-link"
            :to="{
              name: 'analysisInformation',
              params: { analysisId: item.analysisVersion.analysis.id }
            }"
          >
            {{ item.analysisVersion.analysis.title }}
          </router-link>
        </template>

        <template v-slot:item.analysisVersion="{ item }">
          {{ item.analysisVersion.title }}
        </template>

        <template v-slot:item.startTime="{ item }">
          {{ item.startTime | formatDateTime }}
        </template>

        <template v-slot:item.endTime="{ item }">
          {{ item.endTime | formatDateTime }}
        </template>

        <template v-slot:item.duration="{ item }">
          {{ formatDuration(item.duration) }}
        </template>

        <template v-slot:item.user="{ item }">
          {{ item.user ? item.user.fullName : '' }}
        </template>

        <template v-slot:item.status="{ item }">
          <v-icon small :color="statusColor[item.status]">
            circle
          </v-icon>
        </template>

        <template v-slot:item.download="{ item }">
          <div v-if="item.status == 'SUCCESS'">
            <a :href="downloadZip(item)">
              <v-icon>
                download
              </v-icon>
            </a>
          </div>
        </template>

        <template v-slot:expanded-item="{ item, headers }">
          <td class="pa-2 blue lighten-5" :colspan="headers.length">
            <v-container fluid>
              <v-row v-if="item.traceback">
                <v-textarea
                  outlined
                  label="traceback"
                  v-model="item.traceback"
                ></v-textarea>
              </v-row>
              <v-row>
                <v-col>
                  <div class="subtitle-1 text-left pl-3">
                    Input
                  </div>
                  <hr />
                  <run-input-information :run="item" />
                </v-col>
                <v-col>
                  <div class="subtitle-1 text-left pl-3">
                    Output
                  </div>
                  <hr />
                  <run-output-information :run="item" />
                </v-col>
              </v-row>
            </v-container>
          </td>
        </template>
      </v-data-table>
    </v-col>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import RunInputInformation from '@/components/analysis/run-input-information.vue'
import RunTableControls from '@/components/analysis/run-table-controls.vue'
import RunOutputInformation from '@/components/analysis/run-output-information.vue'
import { RUNS } from '@/api/analysis/endpoints.js'

export default {
  name: 'RunTable',
  props: {
    subject: { type: Object },
    scan: { type: Object }
  },
  components: { RunInputInformation, RunOutputInformation, RunTableControls },
  data: () => ({
    expanded: [],
    selectedRuns: [],
    loading: false,
    itemsPerPageOptions: [10, 25, 50, -1],
    headers: [
      { text: 'ID', value: 'id', width: 100 },
      { text: 'Analysis', value: 'analysis' },
      { text: 'Version', value: 'analysisVersion' },
      { text: 'Start Time', value: 'startTime', width: 180 },
      { text: 'End Time', value: 'endTime', width: 180 },
      { text: 'Duration', value: 'duration', width: 180 },
      { text: 'User', value: 'user' },
      { text: 'Status', value: 'status', align: 'center' },
      { text: 'Download', value: 'download', align: 'center', sortable: false }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['startTime'],
      sortDesc: [true]
    },
    statusColor: { STARTED: 'orange', SUCCESS: 'green', FAILURE: 'red' }
  }),
  computed: {
    ...mapState('analysis', ['runs', 'runCount'])
  },
  methods: {
    formatDuration: function(d) {
      d = Number(d)
      var h = Math.floor(d / 3600)
      var m = Math.floor((d % 3600) / 60)
      var s = Math.floor((d % 3600) % 60)

      var hDisplay = h > 0 ? String(h).padStart(2, '0') + ':' : '00:'
      var mDisplay = m > 0 ? String(m).padStart(2, '0') + ':' : '00:'
      var sDisplay = s > 0 ? String(s).padStart(2, '0') : '00'
      return hDisplay + mDisplay + sDisplay
    },
    downloadZip: function(run) {
      return `${RUNS}/${run.id}/to_zip`
    },
    ...mapActions('analysis', ['fetchRuns']),
    ...mapActions('mri', ['fetchScanRunSet'])
  }
}
</script>

<style lang="scss" sc{}oped>
.nav-link {
  text-decoration: none;
}
</style>
