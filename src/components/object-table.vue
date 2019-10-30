<template>
  <v-data-table
    hide-default-footer
    :headers="headers"
    :items="entries"
    :no-data-text="noDataText"
  >
    <template v-if="editable" v-slot:item.key="{ item }">
      <v-edit-dialog :return-value.sync="item.key" @save="updateKeys">
        {{ item.key }}
        <template v-slot:input>
          <v-text-field
            v-model="item.key"
            label="Edit"
            single-line
            counter
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.type="{ item }">
      <v-select v-model="item.type" :items="dataTypes" />
    </template>

    <template v-slot:item.value="{ item }">
      <v-edit-dialog
        :readonly="!editable"
        :return-value.sync="item.value"
        @save="updateValue(item)"
      >
        {{ item.value }}
        <template v-slot:input>
          <v-text-field
            v-model="item.value"
            label="Edit"
            single-line
            counter
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.delete="{ item }">
      <v-icon @click="removeEntry(item.key)">
        delete
      </v-icon>
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
  },
  data: () => ({
    object: {},
    dataTypes: ['String', 'Number', 'Boolean', 'Array', 'Object'],
    allHeaders: [
      { text: 'Key', value: 'key', align: 'left' },
      { text: 'Type', value: 'type', align: 'left' },
      { text: 'Value', value: 'value', align: 'left' },
      {
        text: 'Delete',
        value: 'delete',
        align: 'right',
        sortable: false
      }
    ]
  }),
  computed: {
    entries: function() {
      return this.object
        ? Object.entries(this.object).map(entry => ({
            key: entry[0],
            value: entry[1],
            type: this.inferType(entry[1]),
            delete: null
          }))
        : []
    },
    headers: function() {
      return this.editable
        ? this.allHeaders
        : this.allHeaders.filter(header => header.value != 'delete')
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
