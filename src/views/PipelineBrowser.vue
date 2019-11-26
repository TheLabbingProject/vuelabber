<template>
  <v-scale-transition hide-on-leave>
    <v-skeleton-loader v-if="!fetchedPipelines" type="table" />
    <v-col>
      <div class="title text-left pb-1">
        Pipelines
      </div>
      <hr />
      <v-data-table
        item-key="id"
        show-expand
        single-expand
        :expanded.sync="expanded"
        :headers="headers"
        :items="pipelines"
        :loading="loading"
      >
        <template v-slot:item.created="{ item }">
          {{ item.created | formatDateTime }}
        </template>

        <template v-slot:item.modified="{ item }">
          {{ item.modified | formatDateTime }}
        </template>
      </v-data-table>
    </v-col>
  </v-scale-transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PipelineBrowser',
  created() {
    this.fetchPipelines().then(() => (this.fetchedPipelines = true))
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Created', value: 'created', align: 'center' },
      { text: 'Modified', value: 'modified', align: 'center' }
    ],
    loading: false,
    fetchedPipelines: false
  }),
  computed: {
    ...mapState('analysis', ['pipelines'])
  },
  methods: {
    ...mapActions('analysis', ['fetchPipelines'])
  }
}
</script>

<style lang="scss" scoped></style>
