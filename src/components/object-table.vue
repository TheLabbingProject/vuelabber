<template>
  <v-data-table hide-default-footer :headers="headers" :items="entries" :no-data-text="noDataText">
    <template v-slot:top>
      <v-row class="px-4 align-center">
        <span class="text-xs-left grey--text">{{ title }}</span>
        <v-spacer />
        <v-btn small color="success" v-if="editable" @click="createEntry">Add</v-btn>
      </v-row>
    </template>
    <template v-if="editable" v-slot:item.key="{ item }">
      <v-edit-dialog :return-value.sync="item.key" @save="updateKeys">
        {{ item.key }}
        <template v-slot:input>
          <v-text-field v-model="item.key" label="Edit" single-line counter></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.type="{ item }">
      <v-select
        v-model="item.type"
        :items="dataTypes"
        :readonly="!editable"
        @change="updateProperty(item)"
      />
    </template>

    <template v-slot:item.value="{ item }">
      <!-- String -->
      <v-edit-dialog
        v-if="item.type === 'String'"
        :readonly="!editable"
        :return-value.sync="item.value"
        @save="updateProperty(item)"
      >
        {{ item.value }}
        <template v-slot:input>
          <v-text-field v-model="item.value" label="Edit" single-line counter />
        </template>
      </v-edit-dialog>

      <!-- Integer or Float -->
      <v-edit-dialog
        v-else-if="item.type === 'Integer' || item.type === 'Float'"
        :readonly="!editable"
        :return-value.sync="item.value"
        @save="updateProperty(item)"
      >
        {{ item.value }}
        <template v-slot:input>
          <v-text-field type="number" v-model="item.value" label="Edit" single-line counter />
        </template>
      </v-edit-dialog>

      <!-- Boolean -->
      <v-select
        v-else-if="item.type === 'Boolean'"
        v-model="item.value"
        :items="[
          { text: 'True', value: true },
          { text: 'False', value: false }
        ]"
        @change="updateProperty(item)"
      />

      <!-- List -->
      <v-edit-dialog
        v-if="item.type === 'List'"
        :readonly="!editable"
        :return-value.sync="item.value"
        @save="updateProperty(item)"
      >
        {{ item.value }}
        <template v-slot:input>
          <v-text-field v-model="item.value" label="Edit" single-line />
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.delete="{ item }">
      <v-icon @click="removeEntry(item.key)">delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { isInteger } from '@/components/utils'

export default {
  name: 'ObjectTable',
  props: {
    editable: { type: Boolean, default: false },
    existingObject: Object,
    noDataText: { type: String, default: 'No existing entries.' },
    title: String
  },
  created() {
    if (this.existingObject) {
      this.object = Object.assign({}, this.existingObject)
    }
  },
  data: () => ({
    object: {},
    dataTypes: ['String', 'Integer', 'Float', 'Boolean', 'List'],
    allHeaders: [
      { text: 'Key', value: 'key', align: 'left', width: '20%' },
      { text: 'Type', value: 'type', align: 'left', width: '25%' },
      { text: 'Value', value: 'value', align: 'left', width: '55%' },
      {
        text: 'Delete',
        value: 'delete',
        align: 'right',
        sortable: false,
        width: '10%'
      }
    ]
  }),
  computed: {
    entries: function() {
      return this.object
        ? Object.entries(this.object).map(entry => ({
            key: entry[0],
            value: entry[1].value,
            type: entry[1].type
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
    updateOrigin: function() {
      this.$emit('update-object', this.object)
    },
    updateKeys: function() {
      let updatedObject = Object.assign({}, this.object)
      updatedObject[this.updatedKey] = updatedObject[this.oldKey]
      delete updatedObject[this.oldKey]
      this.object = updatedObject
      this.updateOrigin()
    },
    updateProperty: function({ key, value, type }) {
      value = this.fixValue(value, type)
      this.object[key] = { value, type }
      this.updateOrigin()
    },
    arrayFromString: function(value) {
      value = String(value)
      if (value.charAt(0) != '[') {
        value = '[' + value
      }
      if (value.charAt(value.length - 1) != ']') {
        value += ']'
      }
      return JSON.parse(value)
    },
    fixValue: function(value, type) {
      if (type === 'Integer' || type === 'Float') {
        value = Number(value)
        if (isNaN(value)) {
          value = 0
        }
      }
      if (type === 'Float') {
        return isInteger(value) ? value.toFixed(1) : value
      } else if (type === 'Integer') {
        return Number(value).toFixed()
      } else if (type === 'Boolean') {
        return Boolean(value)
      } else if (type === 'List') {
        return this.arrayFromString(value)
      } else if (type === 'String') {
        return String(value)
      } else {
        return value
      }
    },
    removeEntry: function(key) {
      let updatedObject = Object.assign({}, this.object)
      delete updatedObject[key]
      this.object = updatedObject
      this.updateOrigin()
    },
    createEntry() {
      // Create new key
      if (!('Key' in this.object)) {
        this.object = {
          ...this.object,
          Key: { value: 'Value', type: 'String' }
        }
      } else {
        // Increment last custom attribute key named Key
        let keys = Object.keys(this.object)
        keys = keys.filter(key => key.startsWith('Key')).sort()
        let last = Number(keys[keys.length - 1].slice(3))
        this.object = {
          ...this.object,
          [`Key${last + 1}`]: { value: 'Value', type: 'String' }
        }
      }
      this.updateOrigin()
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
