<template>
  <v-col>
    <v-data-table item-key="id" :headers="headers" :items="sequenceTypes" :loading="loading">
      <!-- Title and Create button -->
      <template v-slot:top>
        <v-row class="px-3 pb-3">
          <span class="title">MRI Sequence Types</span>
          <v-spacer />
          <v-dialog v-model="createSequenceTypeDialog" width="400px">
            <template v-slot:activator="{ on }">
              <v-btn class="success" v-on="on">Create</v-btn>
            </template>
            <edit-sequence-type @close-dialog="createSequenceTypeDialog = false" />
          </v-dialog>
        </v-row>
      </template>

      <!-- Scanning Sequence & Sequence Variant -->
      <template v-slot:item.sequenceDefinitions="{ item }">
        <v-col>
          <div class="py-1" v-for="(definition, index) in item.sequenceDefinitions" :key="index">
            <v-row>
              <v-col>
                <v-chip
                  small
                  v-for="(sequence, index2) in definition.scanningSequence"
                  :key="index2"
                >
                  <v-avatar :color="scanningSequences[sequence].color">{{ sequence }}</v-avatar>
                  {{ scanningSequences[sequence].name }}
                </v-chip>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <v-chip small v-for="(variant, index2) in definition.sequenceVariant" :key="index2">
                  <v-avatar
                    :color="sequenceVariants[variant].color"
                  >{{ variant != "NONE" ? variant : "NO" }}</v-avatar>
                  {{ sequenceVariants[variant].name }}
                </v-chip>
              </v-col>
              <!-- Edit Definition -->
              <v-col>
                <v-dialog v-model="editSequenceTypeDefinitionDialog[definition.id]" width="550px">
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">edit</v-icon>
                  </template>
                  <edit-sequence-type-definition
                    :existingSequenceTypeDefinition="definition"
                    @close-dialog="editSequenceTypeDefinitionDialog[definition.id] = false"
                  />
                </v-dialog>
              </v-col>
              <!-- Delete Definition -->
              <v-col>
                <v-dialog v-model="deleteSequenceTypeDefinitionDialog[definition.id]" width="550px">
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">delete</v-icon>
                  </template>
                  <delete-dialog
                    :action="deleteSequenceTypeDefinition"
                    :input="definition"
                    @close-dialog="deleteSequenceTypeDefinitionDialog[definition.id] = false"
                  />
                </v-dialog>
              </v-col>
            </v-row>
            <div class="py-1"></div>
            <v-divider v-if="index < item.sequenceDefinitions.length - 1"></v-divider>
          </div>
        </v-col>
      </template>

      <!-- Add Definition -->
      <template v-slot:item.add="{ item }">
        <v-dialog v-model="createSequenceTypeDefinitionDialog[item.id]" width="400px">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">mdi-plus</v-icon>
          </template>
          <edit-sequence-type-definition
            :sequenceType="item"
            @close-dialog="createSequenceTypeDefinitionDialog[item.id] = false"
            :key="createSequenceTypeDefinitionDialog[item.id]"
          />
        </v-dialog>
      </template>

      <!-- Edit -->
      <template v-slot:item.edit="{ item }">
        <v-dialog v-model="editSequenceTypeDialog[item.id]" width="400px">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">edit</v-icon>
          </template>
          <edit-sequence-type
            :existingSequenceType="item"
            @close-dialog="editSequenceTypeDialog[item.id] = false"
          />
        </v-dialog>
      </template>

      <!-- Delete -->
      <template v-slot:item.delete="{ item }">
        <v-dialog v-model="deleteSequenceTypeDialog[item.id]" width="400px">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">delete</v-icon>
          </template>
          <delete-dialog
            :action="deleteSequenceType"
            :input="item"
            @close-dialog="deleteSequenceTypeDialog[item.id] = false"
          />
        </v-dialog>
      </template>
    </v-data-table>
  </v-col>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'
import EditSequenceType from '@/components/mri/edit-sequence-type.vue'
import EditSequenceTypeDefinition from '@/components/mri/edit-sequence-type-definition.vue'
import DeleteDialog from '@/components/deleteDialog.vue'

export default {
  name: 'SequenceTypes',
  components: { DeleteDialog, EditSequenceType, EditSequenceTypeDefinition },
  created() {
    this.fetchSequenceTypes()
  },
  data: () => ({
    loading: false,
    headers: [
      { text: 'Title', value: 'title', align: 'left' },
      {
        text: 'Scanning Sequence & Variants',
        value: 'sequenceDefinitions',
        align: 'center'
      },
      {
        text: 'Description',
        value: 'description',
        align: 'left',
        width: '400px'
      },
      {
        text: 'Add Definition',
        value: 'add',
        align: 'center'
      },
      { text: 'Edit', value: 'edit', align: 'left' },
      { text: 'Delete', value: 'delete', align: 'left' }
    ],
    createSequenceTypeDialog: false,
    createSequenceTypeDefinitionDialog: {},
    deleteSequenceTypeDialog: {},
    deleteSequenceTypeDefinitionDialog: {},
    editSequenceTypeDialog: {},
    editSequenceTypeDefinitionDialog: {},
    scanningSequences,
    sequenceVariants,
    sequenceTypeDefinition: {}
  }),
  computed: {
    ...mapState('mri', ['sequenceTypes'])
  },
  methods: {
    ...mapActions('mri', [
      'fetchSequenceTypes',
      'deleteSequenceType',
      'deleteSequenceTypeDefinition'
    ])
  }
}
</script>

<style lang="scss" scoped></style>
