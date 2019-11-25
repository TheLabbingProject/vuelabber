<template>
  <v-data-table
    item-key="id"
    show-expand
    :expanded.sync="expanded"
    :headers="headers"
    :hide-default-footer="true"
    :items="inputDefinitions"
    :items-per-page="-1"
    :loading="loading"
  >
    <template v-slot:item.required="{ item }">
      <v-icon v-if="item.required">
        star
      </v-icon>
    </template>

    <template v-slot:expanded-item="{ item, headers }">
      <td class="pa-2 purple lighten-4" :colspan="headers.length">
        <input-definition-configuration :inputDefinition="item" />
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import InputDefinitionConfiguration from '@/components/analysis/input-definition-configuration.vue'

export default {
  name: 'InputDefinitionTable',
  props: { inputSpecification: Object },
  components: { InputDefinitionConfiguration },
  created() {
    this.fetchInputDefinitions({
      filters: { inputSpecification: this.inputSpecification.id },
      pagination: {}
    })
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'Key', value: 'key', align: 'left', width: '15%' },
      {
        text: 'Required',
        value: 'required',
        align: 'center',
        width: '10%'
      },
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
    ...mapState('analysis', ['inputDefinitions'])
  },
  methods: {
    ...mapActions('analysis', ['fetchInputDefinitions'])
  }
}
</script>

<style lang="scss" scoped></style>
