<template>
  <v-data-table
    item-key="id"
    show-expand
    :expanded.sync="expanded"
    :headers="headers"
    :hide-default-footer="true"
    :items="categories"
    :loading="loading"
  >
    <template v-slot:expanded-item="{ item, headers }">
      <td class="pr-0 pl-4 blue lighten-5" :colspan="headers.length">
        <category-table v-if="hasSubcategories(item)" :parentCategory="item" />
        <analysis-table v-else :category="item" />
      </td>
    </template>
  </v-data-table>
</template>

<script>
import AnalysisTable from '@/components/analysis/analysis-table.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CategoryTable',
  components: { AnalysisTable },
  props: { parentCategory: { type: Object, default: () => ({}) } },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'Title', value: 'title', align: 'left', width: '5%' },
      { text: 'Description', value: 'description', align: 'left' }
    ],
    loading: false
  }),
  computed: {
    categories: function() {
      if (this.isRoot) {
        return this.rootCategories.slice()
      } else {
        return this.childCategories(this.parentCategory)
      }
    },
    isRoot: function() {
      return isEmptyObject(this.parentCategory)
    },
    ...mapGetters('analysis', ['childCategories', 'rootCategories'])
  },
  methods: {
    hasSubcategories: function(category) {
      return category.subcategories.length
    },
    ...mapActions('analysis', ['fetchCategories'])
  }
}

const isEmptyObject = obj => {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}
</script>

<style lang="scss" scoped></style>
