<template>
  <v-col>
    <div class="title text-left pb-1">
      Analyses
    </div>
    <hr />
    <category-table />
  </v-col>
</template>

<script>
import categoryTable from '@/components/analysis/category-table.vue'
import { mapActions } from 'vuex'

export default {
  name: 'AnalysisBrowser',
  components: { categoryTable },
  created() {
    this.fetchCategories()
  },
  methods: {
    ...mapActions('analysis', ['fetchCategories'])
  }
}
</script>

<style lang="scss" scoped></style>
