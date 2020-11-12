<template>
  <v-data-table
    item-key="id"
    show-expand
    :expanded.sync="expanded"
    :headers="headers"
    :hide-default-footer="true"
    :items="outputSpecifications"
    :loading="loading"
  >
    <template v-slot:item.created="{ item }">
      {{ item.created | formatDateTime }}
    </template>
    <template v-slot:item.modified="{ item }">
      {{ item.modified | formatDateTime }}
    </template>

    <template v-slot:expanded-item="{ item, headers }">
      <td class="pa-2 purple lighten-5" :colspan="headers.length">
        <output-definition-table :outputSpecification="item" />
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapState } from 'vuex'
import OutputDefinitionTable from '@/components/analysis/output-definition-table.vue'

export default {
  name: 'OutputSpecificationTable',
  components: { OutputDefinitionTable },
  props: { analysis: Object, expandedOutputSpecificationId: Number },
  created() {
    if (this.expandedOutputSpecificationId) {
      this.expandByChosenId(this.expandedOutputSpecificationId)
    }
  },
  data: () => ({
    expanded: [],
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
        text: 'Number of Output Definitions',
        value: 'outputDefinitionsCount',
        align: 'center',
        width: '15%'
      }
    ],
    loading: false
  }),
  computed: {
    ...mapState('analysis', ['outputSpecifications'])
  },
  methods: {
    expandByChosenId: function(chosenId) {
      this.expanded = this.outputSpecifications.filter(
        outputSpecification => outputSpecification.id === chosenId
      )
    }
  },
  watch: {
    expandedOutputSpecificationId: function(chosenId) {
      this.expandByChosenId(chosenId)
    }
  }
}
</script>

<style lang="scss" scoped></style>
