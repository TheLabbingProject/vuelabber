<template>
  <v-data-table
    item-key="id"
    show-expand
    :expanded.sync="expanded"
    :headers="headers"
    :hide-default-footer="true"
    :items="filteredCategories"
    :loading="loading"
  >
    <template v-slot:expanded-item="{ item, headers }">
      <td class="pr-0 pl-4 blue lighten-5" :colspan="headers.length">
        <analysis-table v-if="isEmptyArray(item.subcategories)" :category="item" />
        <category-table v-else :parentCategory="item" />
      </td>
    </template>
  </v-data-table>
</template>

<script>
import AnalysisTable from '@/components/analysis/analysis-table.vue'
import { isEmptyArray, isEmptyObject } from '@/utils'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CategoryTable',
  components: { AnalysisTable },
  props: { parentCategory: { type: Object, default: () => ({}) } },
  created() {
    this.fetchFilteredCategories()
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'Title', value: 'title', align: 'left', width: '5%' },
      { text: 'Description', value: 'description', align: 'left' }
    ],
    loading: false,
    filteredCategories: []
  }),
  computed: {
    isRoot: function() {
      return isEmptyObject(this.parentCategory)
    },
    ...mapGetters('analysis', ['childCategories', 'rootCategories'])
  },
  methods: {
    getFilters: function() {
      return {
        isRoot: this.isRoot,
        parent: this.isRoot ? '' : this.parentCategory.title
      }
    },
    getFilteredCategories: function() {
      return this.isRoot
        ? this.rootCategories.slice()
        : this.childCategories(this.parentCategory).slice()
    },
    fetchFilteredCategories: function() {
      this.loading = true
      this.fetchCategories({
        filters: this.getFilters(),
        pagination: {},
        append: !this.isRoot
      })
        .then(() => (this.filteredCategories = this.getFilteredCategories()))
        .then(() => (this.loading = false))
    },
    isEmptyArray,
    ...mapActions('analysis', ['fetchCategories'])
  }
}
</script>

<style lang="scss" scoped></style>
