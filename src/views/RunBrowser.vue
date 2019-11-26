<template>
  <v-scale-transition hide-on-leave>
    <v-skeleton-loader v-if="!fetchedRuns" type="table" />
    <v-col>
      <div class="title text-left pb-1">
        Runs
      </div>
      <hr />
      <v-data-table
        item-key="id"
        show-expand
        single-expand
        :expanded.sync="expanded"
        :headers="headers"
        :items="runs"
        :loading="loading"
      >
        <template v-slot:item.created="{ item }">
          {{ item.created | formatDateTime }}
        </template>

        <template v-slot:item.analysis="{ item }">
          <router-link
            class="nav-link"
            :to="{
              name: 'analysisInformation',
              params: { analysisId: getRunAnalysis(item).id }
            }"
          >
            {{ getRunAnalysis(item).title }}
          </router-link>
        </template>

        <template v-slot:item.analysisVersion="{ item }">
          {{ getRunAnalysisVersion(item).title }}
        </template>

        <template v-slot:item.user="{ item }">
          {{ getUserByUrl(item.user).username }}
        </template>

        <template v-slot:expanded-item="{ item, headers }">
          <td class="pa-2 blue lighten-5" :colspan="headers.length">
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
          </td>
        </template>
      </v-data-table>
    </v-col>
  </v-scale-transition>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import RunInputInformation from '@/components/analysis/run-input-information.vue'
import RunOutputInformation from '@/components/analysis/run-output-information.vue'

export default {
  name: 'RunBrowser',
  components: { RunInputInformation, RunOutputInformation },
  created() {
    this.loading = true
    this.fetchUsers({ filters: {}, pagination: {} })
    this.fetchAnalyses()
    this.fetchAnalysisVersions()
    this.fetchRuns().then(() => (this.fetchedRuns = true))
    this.loading = false
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'ID', value: 'id', width: 100 },
      { text: 'Created', value: 'created', width: 160 },
      { text: 'Analysis', value: 'analysis' },
      { text: 'Version', value: 'analysisVersion' },
      { text: 'User', value: 'user' }
    ],
    loading: false,
    fetchedRuns: false
  }),
  computed: {
    ...mapGetters('accounts', ['getUserByUrl']),
    ...mapGetters('analysis', ['getRunAnalysis', 'getRunAnalysisVersion']),
    ...mapState('analysis', ['runs'])
  },
  methods: {
    ...mapActions('accounts', ['fetchUsers']),
    ...mapActions('analysis', [
      'fetchAnalyses',
      'fetchAnalysisVersions',
      'fetchRuns'
    ])
  }
}
</script>

<style lang="scss" scoped>
.nav-link {
  text-decoration: none;
}
</style>
