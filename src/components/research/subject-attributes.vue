<template>
  <v-data-table
    hide-actions
    no-data-text="No custom attributes found."
    :headers="headers"
    :items="entries"
  >
    <template v-slot:items="props">
      <tr>
        <td class="text-xs-left">
          <v-edit-dialog
            lazy
            :return-value.sync="props.item.key"
            @save="updateKeys"
          >
            {{ props.item.key }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.key"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
        <td class="text-xs-left">
          {{ props.item.value }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'SubjectAttributes',
  props: { existingObject: Object },
  created() {
    if (this.existingObject) {
      this.object = Object.assign(this.existingObject)
    }
  },
  data: () => ({
    headers: [
      { text: 'Key', value: 'key', align: 'left' },
      { text: 'Value', value: 'value', align: 'left' }
    ],
    object: {}
  }),
  computed: {
    entries: function() {
      return this.object
        ? Object.entries(this.object).map(entry => ({
            key: entry[0],
            value: entry[1]
          }))
        : []
    },
    oldKeys: function() {
      return Object.keys(this.object)
    },
    updatedKeys: function() {
      return this.entries.map(entry => entry.key)
    },
    oldKey: function() {
      return this.oldKeys.filter(key => this.updatedKeys.indexOf(key) === -1)
    },
    updatedKey: function() {
      return this.updatedKeys.filter(key => this.oldKeys.indexOf(key) === -1)
    }
  },
  methods: {
    updateKeys: function() {
      let updatedObject = Object.assign({}, this.object)
      updatedObject[this.updatedKey] = updatedObject[this.oldKey]
      delete updatedObject[this.oldKey]
      this.object = updatedObject
    }
  }
}
</script>

<style lang="scss" scoped></style>
