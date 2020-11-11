<template>
  <v-data-table
    item-key="id"
    :headers="headers"
    :hide-default-footer="true"
    :items="analyses"
    :loading="loading"
  >
    <template v-slot:item.title="{ item }">
      <router-link
        :to="{ name: 'analysisInformation', params: { analysisId: item.id } }"
        class="nav-link"
        >{{ item.title }}</router-link
      >
    </template>

    <template v-slot:item.versions="{ item }">{{
      getAnalysisVersions(item).length
    }}</template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AnalysisTable',
  props: { category: Object },
  data: () => ({
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Versions', value: 'versions' }
    ],
    loading: false
  }),
  computed: {
    analyses: function() {
      return this.categoryAnalyses(this.category)
    },
    ...mapGetters('analysis', ['categoryAnalyses', 'getAnalysisVersions'])
  }
}
</script>

<style lang="scss" scoped>
.nav-link {
  text-decoration: none;
}
</style>
