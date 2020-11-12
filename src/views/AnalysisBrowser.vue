<template>
  <div>
    <div class="title text-left pb-1">Analyses</div>
    <hr />
    <category-table />
  </div>
</template>

<script>
import categoryTable from '@/components/analysis/category-table.vue'

export default {
  name: 'AnalysisBrowser',
  components: { categoryTable }
}
</script>

<style lang="scss" scoped></style>
