<template>
  <v-data-table
    item-key="id"
    :headers="headers"
    :hide-default-footer="true"
    :items="outputDefinitions"
    :items-per-page="-1"
    :loading="loading"
  >
  </v-data-table>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'OutputDefinitionTable',
  props: { outputSpecification: Object },
  created() {
    this.fetchOutputDefinitions({
      filters: { outputSpecification: this.outputSpecification.id },
      pagination: {}
    })
  },
  data: () => ({
    headers: [
      { text: 'Key', value: 'key', align: 'left', width: '15%' },
      {
        text: 'Type',
        value: 'type',
        align: 'left',
        width: '10%'
      },
      {
        text: 'Description',
        value: 'description',
        align: 'left'
      }
    ],
    loading: false
  }),
  computed: {
    ...mapState('analysis', ['outputDefinitions'])
  },
  methods: {
    ...mapActions('analysis', ['fetchOutputDefinitions'])
  }
}
</script>

<style lang="scss" scoped></style>
