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
  </v-data-table>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'AnalysisTable',
  props: { category: Object },
  created() {
    let filters = { category: this.category.id }
    this.fetchAnalyses({ filters: filters, pagination: {} })
  },
  data: () => ({
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' }
    ],
    loading: false
  }),
  computed: {
    ...mapState('analysis', ['analyses'])
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
