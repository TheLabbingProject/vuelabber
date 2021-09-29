<template>
  <v-data-table
    item-key="id"
    show-expand
    :expanded.sync="expanded"
    :headers="headers"
    :hide-default-footer="true"
    :items="inputSpecifications"
    :loading="loading"
  >
    <template v-slot:[`item.created`]="{ item }">
      {{ item.created | formatDateTime }}
    </template>
    <template v-slot:[`item.modified`]="{ item }">
      {{ item.modified | formatDateTime }}
    </template>

    <template v-slot:expanded-item="{ item, headers }">
      <td class="pa-2 purple lighten-5" :colspan="headers.length">
        <input-definition-table :inputSpecification="item" />
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapState } from 'vuex'
import InputDefinitionTable from '@/components/analysis/input-definition-table.vue'

export default {
  name: 'InputSpecificationTable',
  components: { InputDefinitionTable },
  props: { analysis: Object, expandedInputSpecificationId: Number },
  created() {
    if (this.expandedInputSpecificationId) {
      this.expandByChosenId(this.expandedInputSpecificationId)
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
        text: 'Number of Input Definitions',
        value: 'inputDefinitionsCount',
        align: 'center',
        width: '15%'
      }
    ],
    loading: false
  }),
  computed: {
    ...mapState('analysis', ['inputSpecifications'])
  },
  methods: {
    expandByChosenId: function(chosenId) {
      this.expanded = this.inputSpecifications.filter(
        inputSpecification => inputSpecification.id === chosenId
      )
    }
  },
  watch: {
    expandedInputSpecificationId: function(chosenId) {
      this.expandByChosenId(chosenId)
    }
  }
}
</script>

<style lang="scss" scoped></style>
