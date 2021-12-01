<template>
  <v-container fluid class="pa-0">
    <v-col class="pa-0">
      <v-row class="pt-2 pl-2">
        <div class="title text-left pb-1">
          Runs
        </div>
      </v-row>
      <v-row>
        <run-table />
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import RunTable from '@/components/analysis/run-table.vue'

export default {
  name: 'RunBrowser',
  components: { RunTable }
}
</script>

<style lang="scss" scoped></style>
