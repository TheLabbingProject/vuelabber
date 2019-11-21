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
      <td :colspan="headers.length">
        <category-table :parentCategory="item" />
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'categoryTable',
  props: { parentCategory: { type: Object, default: () => ({}) } },
  created() {
    if (this.isRoot) {
      this.categories = this.rootCategories.slice()
    } else {
      this.categories = this.childCategories(this.parentCategory)
    }
  },
  data: () => ({
    categories: [],
    expanded: [],
    headers: [
      { text: 'Title', value: 'title', align: 'left', width: '5%' },
      { text: 'Description', value: 'description', align: 'left' }
    ],
    loading: false
  }),
  computed: {
    isRoot: function() {
      return (
        Object.entries(this.parentCategory).length === 0 &&
        this.parentCategory.constructor === Object
      )
    },
    ...mapGetters('analysis', ['childCategories', 'rootCategories'])
  }
}
</script>

<style lang="scss" scoped></style>
