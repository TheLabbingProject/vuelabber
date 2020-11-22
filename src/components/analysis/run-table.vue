<template>
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
          params: { analysisId: item.analysisVersion.analysis.id }
        }"
      >
        {{ item.analysisVersion.analysis.title }}
      </router-link>
    </template>

    <template v-slot:item.analysisVersion="{ item }">
      {{ item.analysisVersion.title }}
    </template>

    <template v-slot:item.user="{ item }">
      {{ item.user ? item.user.username : '' }}
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
</template>

<script>
import { mapState } from 'vuex'
import RunInputInformation from '@/components/analysis/run-input-information.vue'
import RunOutputInformation from '@/components/analysis/run-output-information.vue'

export default {
  name: 'RunTable',
  props: { loading: Boolean },
  components: { RunInputInformation, RunOutputInformation },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'ID', value: 'id', width: 100 },
      { text: 'Created', value: 'created', width: 180 },
      { text: 'Analysis', value: 'analysis' },
      { text: 'Version', value: 'analysisVersion' },
      { text: 'User', value: 'user' }
    ]
  }),
  computed: {
    ...mapState('analysis', ['runs'])
  }
}
</script>

<style lang="scss" scoped>
.nav-link {
  text-decoration: none;
}
</style>
