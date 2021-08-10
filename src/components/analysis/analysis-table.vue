<template>
  <v-col>
    <v-row>
      <anaylsis-table-controls :options="options" />
    </v-row>
    <v-row>
      <v-data-table
        dense
        item-key="id"
        :headers="headers"
        :items="analyses"
        :loading="loading"
        :options.sync="options"
        :server-items-length="analysesCount"
        :footer-props="{
          itemsPerPageOptions
        }"
      >
        <template v-slot:item.title="{ item }">
          <router-link
            :to="{
              name: 'analysisInformation',
              params: { analysisId: item.id }
            }"
            class="nav-link"
            >{{ item.title }}</router-link
          >
        </template>
      </v-data-table>
    </v-row>
  </v-col>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AnaylsisTableControls from './anaylsis-table-controls.vue'

export default {
  name: 'AnalysisTable',
  components: { AnaylsisTableControls },
  props: { category: Object },
  created() {
    let filters = { category: this.category.id }
    let options = this.options
    this.fetchAnalyses({ filters, options })
  },
  data: () => ({
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' }
    ],
    loading: false,
    itemsPerPageOptions: [10, 25, 50, 100],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['title'],
      sortDesc: [false]
    }
  }),
  computed: {
    ...mapState('analysis', ['analyses', 'analysesCount'])
  },
  methods: {
    ...mapActions('analysis', ['fetchAnalyses'])
  }
}
</script>

<style lang="scss" scoped>
.nav-link {
  text-decoration: none;
}
</style>
