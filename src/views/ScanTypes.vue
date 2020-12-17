<template>
  <!-- Method Fields and Values -->
  <v-col>
    <v-row v-for="item in scanClassifications" :key="item.name">
      <v-col>
        <span>{{ item.name }}</span>
        <div v-if="!item.expanded">
          <v-icon @click="changeVisibility(item)">add</v-icon>
        </div>
        <div v-else>
          <v-icon @click="changeVisibility(item)">remove</v-icon>
        </div>
        <v-divider v-if="scanClassifications.length > 1"></v-divider>
      </v-col>
      <v-col>
        <div v-if="item.expanded" class="px-3 py-3">
          <span class="underline">Rules</span>
          <div v-for="(field, index) in item.fields" :key="index" class="px-5">
            <span :class="fieldClass(index)">{{ formatField(index) }}</span>
            <span v-if="!field.expanded">
              <v-icon @click="changeVisibility(field)">add</v-icon>
            </span>
            <span v-else>
              <v-icon @click="changeVisibility(field)" class="px-5"
                >remove</v-icon
              ><span>{{ field.value }}</span>
            </span>
            <v-divider v-if="item.fields.length > 1"></v-divider>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-3 pb-3">
        <v-dialog v-model="createSequenceTypeDialog" width="400px">
          <template v-slot:activator="{ on }">
            <v-btn class="success" v-on="on">Define New Method</v-btn>
          </template>
          <span>FIELDS TO ADD</span>
        </v-dialog>
      </v-col>
      <v-col class="px-3 pb-3">
        <v-btn
          class="ma-2 success"
          :loading="loadingCSV"
          :disabled="loadingCSV"
          @click="getCSVWrapper([34])"
        >
          To CSV
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'
// import EditSequenceType from '@/components/mri/edit-sequence-type.vue'
// import EditSequenceTypeDefinition from '@/components/mri/edit-sequence-type-definition.vue'
// import DeleteDialog from '@/components/deleteDialog.vue'

export default {
  name: 'ScanTypes',
  //   components: { EditSequenceType },
  created() {
    this.fetchSequenceTypes()
    this.fetchScanClassifications()
  },
  data: () => ({
    loading: false,
    loadingCSV: false,
    headers: [
      { text: 'Name', value: 'name', align: 'left' },
      {
        text: 'Fields',
        value: 'fields',
        align: 'center'
      }
    ],
    createSequenceTypeDialog: false,
    createSequenceTypeDefinitionDialog: {},
    deleteSequenceTypeDialog: {},
    deleteSequenceTypeDefinitionDialog: {},
    editSequenceTypeDialog: {},
    editSequenceTypeDefinitionDialog: {},
    scanningSequences,
    sequenceVariants,
    sequenceTypeDefinition: {},
    scanClassifications: []
  }),
  computed: {
    classifications() {
      return this.scanClassifications
    },
    ...mapState('mri', ['sequenceTypes'])
  },
  methods: {
    updatingSequenceTypes(indicator, item) {
      indicator[item.id] = false
      this.fetchSequenceTypes()
    },
    getCSVWrapper(ids) {
      this.loadingCSV = true
      this.getCSV(ids).then(() => (this.loadingCSV = false))
    },
    fetchScanClassifications() {
      this.scanClassifications.push({
        name: 'MPRAGE',
        fields: {
          '-Manufacturer': { value: 'SIEMENS', expanded: false },
          SequenceName: { value: 'TFL3D1', expanded: false },
          scanningSequence: { value: ['GR', 'IR'], expanded: false },
          SequenceVariant: { value: ['MP', 'SP'], expanded: false }
        },
        expanded: false
      })
      this.scanClassifications.push({
        name: 'SPGR',
        fields: {
          Manufacturer: { value: 'GE MEDICAL SYSTEMS', expanded: false },
          InternalPulseSequenceName: {
            value: ['3DGRASS', 'EFGRE3D'],
            expanded: false
          },
          SequenceVariant: { value: ['SS'], expanded: false }
        },
        expanded: false
      })
    },
    changeVisibility(item) {
      item.expanded = !item.expanded
    },
    formatField(name) {
      return name[0] != '-' ? name : name.slice(1)
    },
    fieldClass(name) {
      var output = name[0] == '-' ? 'red--text' : 'green--text'
      return output + ' bold'
    },
    ...mapActions('mri', [
      'fetchSequenceTypes',
      'deleteSequenceType',
      'deleteSequenceTypeDefinition',
      'getCSV',
      'deleteTmpCSV'
    ])
  }
}
</script>

<style lang="scss" scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.center {
  text-align: center;
}
.underline {
  text-decoration: underline;
}
.bold {
  font-weight: bold;
}
</style>
