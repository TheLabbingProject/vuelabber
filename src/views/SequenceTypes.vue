<template>
  <v-col>
    <v-data-table
      item-key="id"
      :headers="headers"
      :items="sequenceTypes"
      :loading="loading"
    >
      <!-- Title and Create button -->
      <template v-slot:top>
        <v-row class="px-3 pb-3">
          <span class="title">MRI Sequence Types</span>
          <v-spacer />
          <v-dialog v-model="createSequenceTypeDialog" width="400px">
            <template v-slot:activator="{ on }">
              <v-btn class="success" v-on="on">
                Create
              </v-btn>
            </template>
            <edit-sequence-type
              @close-dialog="createSequenceTypeDialog = false"
            />
          </v-dialog>
        </v-row>
      </template>

      <!-- Scanning Sequence -->
      <template v-slot:item.scanningSequence="{ item }">
        <v-col>
          <div
            class="py-1"
            v-for="(sequence, index) in item.scanningSequence"
            :key="index"
          >
            <v-chip small>
              <v-avatar :color="scanningSequences[sequence].color">
                {{ sequence }}
              </v-avatar>
              {{ scanningSequences[sequence].name }}
            </v-chip>
          </div>
        </v-col>
      </template>

      <!-- Sequence Variant -->
      <template v-slot:item.sequenceVariant="{ item }">
        <v-col>
          <div
            class="py-1"
            v-for="(variant, index) in item.sequenceVariant"
            :key="index"
          >
            <v-chip small>
              <v-avatar :color="sequenceVariants[variant].color">
                {{ variant }}
              </v-avatar>
              {{ sequenceVariants[variant].name }}
            </v-chip>
          </div>
        </v-col>
      </template>

      <!-- Edit -->
      <template v-slot:item.edit="{ item }">
        <v-dialog v-model="editSequenceTypeDialog[item.id]" width="400px">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">
              edit
            </v-icon>
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
            <v-icon v-on="on">
              delete
            </v-icon>
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
import DeleteDialog from '@/components/deleteDialog.vue'

export default {
  name: 'SequenceTypes',
  components: { DeleteDialog, EditSequenceType },
  created() {
    this.fetchSequenceTypes()
  },
  data: () => ({
    loading: false,
    headers: [
      { text: 'Title', value: 'title', align: 'left' },
      { text: 'Scanning Sequence', value: 'scanningSequence', align: 'left' },
      { text: 'Variants', value: 'sequenceVariant', align: 'left' },
      { text: 'Description', value: 'description', align: 'left' },
      { text: 'Edit', value: 'edit', align: 'left' },
      { text: 'Delete', value: 'delete', align: 'left' }
    ],
    createSequenceTypeDialog: false,
    deleteSequenceTypeDialog: {},
    editSequenceTypeDialog: {},
    scanningSequences,
    sequenceVariants
  }),
  computed: {
    ...mapState('mri', ['sequenceTypes'])
  },
  methods: {
    ...mapActions('mri', ['fetchSequenceTypes', 'deleteSequenceType'])
  }
}
</script>

<style lang="scss" scoped></style>
