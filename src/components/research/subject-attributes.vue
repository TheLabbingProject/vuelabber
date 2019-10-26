<template>
  <v-data-table
    hide-actions
    no-data-text="No custom attributes found."
    :headers="headers"
    :items="keys"
  >
    <template v-slot:items="props">
      <tr>
        <td class="text-xs-left">
          {{ props.item }}
        </td>
        <td class="text-xs-left">
          {{ subject.otherAttributes[props.item] }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'SubjectAttributes',
  props: { subject: Object },
  data: () => ({
    headers: [
      { text: 'Key', value: 'key', align: 'left' },
      { text: 'Value', value: 'value', align: 'left' }
    ]
  }),
  computed: {
    keys: function() {
      return this.subject.otherAttributes
        ? Object.keys(this.subject.otherAttributes)
        : []
    }
  }
}
</script>

<style lang="scss" scoped></style>
