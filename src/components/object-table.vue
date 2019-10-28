<template>
  <v-data-table
    hide-actions
    :headers="headers"
    :items="entries"
    :no-data-text="noDataText"
  >
    <template v-slot:items="props">
      <tr>
        <td class="text-xs-left">
          <v-edit-dialog
            lazy
            :readonly="!editable"
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
        <td style="width: 140px;">
          <v-select v-model="props.item.type" :items="dataTypes" />
        </td>
        <td class="text-xs-left">
          <v-edit-dialog
            lazy
            :readonly="!editable"
            :return-value.sync="props.item.value"
            @save="updateValue(props.item)"
          >
            {{ props.item.value }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.value"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right" v-if="editable">
          <v-icon @click="removeEntry(props.item.key)">
            delete
          </v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'ObjectTable',
  props: {
    existingObject: Object,
    noDataText: { type: String, default: 'No existing entries.' },
    editable: { type: Boolean, default: false }
  },
  created() {
    if (this.existingObject) {
      this.object = Object.assign({}, this.existingObject)
    }
    this.editable
      ? (this.headers = noEditHeaders.concat(deleteEntryHeader))
      : (this.headers = noEditHeaders)
  },
  data: () => ({
    headers: [],
    object: {},
    dataTypes: ['String', 'Number', 'Boolean', 'Array', 'Object']
  }),
  computed: {
    entries: function() {
      return this.object
        ? Object.entries(this.object).map(entry => ({
            key: entry[0],
            value: entry[1],
            type: this.inferType(entry[1])
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
      this.$emit('update-object', this.object)
    },
    updateValue: function({ key, value }) {
      this.object[key] = value
      this.$emit('update-object', this.object)
    },
    removeEntry: function(key) {
      let updatedObject = Object.assign({}, this.object)
      delete updatedObject[key]
      this.object = updatedObject
      this.$emit('update-object', this.object)
    },
    inferType: function(value) {
      if (typeof value === 'string') {
        return 'String'
      } else if (typeof value === 'number') {
        return 'Number'
      } else if (typeof value === 'boolean') {
        return 'Boolean'
      } else if (Array.isArray(value)) {
        return 'Array'
      } else {
        return 'Object'
      }
    }
  },
  watch: {
    existingObject: function(newValue) {
      this.object = Object.assign({}, newValue)
    },
    editable: function(newValue) {
      newValue
        ? (this.headers = noEditHeaders.concat(deleteEntryHeader))
        : (this.headers = noEditHeaders)
    }
  }
}

let noEditHeaders = [
  { text: 'Key', value: 'key', align: 'left' },
  { text: 'Type', value: 'type', align: 'left' },
  { text: 'Value', value: 'value', align: 'left' }
]
let deleteEntryHeader = {
  text: 'Delete',
  value: 'delete',
  align: 'right',
  sortable: false
}
</script>

<style lang="scss" scoped></style>
