<template>
  <div></div>
</template>

<script>
export default {
  name: 'AnalysisTable',
  props: { category: Object },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Versions', value: 'versions' }
    ],
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false
  })
}
</script>

<style lang="scss" scoped></style>
