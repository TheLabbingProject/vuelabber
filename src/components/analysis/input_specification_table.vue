<template>
  <v-data-table
    item-key="id"
    :headers="headers"
    :hide-default-footer="true"
    :items="inputSpecifications"
    :loading="loading"
  >
    <template v-slot:item.inputDefinitionsNumber="{ item }">
      {{ item.inputDefinitions.length }}
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'InputSpecificationTable',
  props: { analysis: Object },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left', width: '5%' },
      {
        text: 'Created',
        value: 'created',
        align: 'center'
      },
      {
        text: 'Modified',
        value: 'modified',
        align: 'center'
      },
      {
        text: 'Number of Input Definitions',
        value: 'inputDefinitionsNumber',
        align: 'left'
      }
    ],
    loading: false
  }),
  computed: {
    inputSpecifications: function() {
      return this.getAnalysisInputSpecifications(this.analysis)
    },
    ...mapGetters('analysis', ['getAnalysisInputSpecifications'])
  }
}
</script>

<style lang="scss" scoped></style>
