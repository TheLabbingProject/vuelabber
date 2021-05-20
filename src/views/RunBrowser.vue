<template>
  <div>
    <div class="title text-left pb-1">
      Runs
    </div>
    <hr />
    <run-table />
  </div>
</template>

<script>
import RunTable from '@/components/analysis/run-table.vue'

export default {
  name: 'RunBrowser',
  components: { RunTable }
}
</script>

<style lang="scss" scoped></style>
