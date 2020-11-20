<template>
  <div>
    <v-data-table
      dense
      item-key="id"
      :headers="headers"
      :items="procedures"
      :loading="loading"
      :options.sync="options"
      :server-items-length="procedureCount"
      show-expand
      single-expand
      :expanded.sync="expanded"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <procedure-table-controls
          ref="controls"
          :options="options"
          :study="study"
          :showControls="showControls"
          @fetch-procedures-start="loading = true"
          @fetch-procedures-end="loading = false"
        />
      </template>

      <!-- Title -->
      <template v-slot:item.title="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.title"
          large
          @save="saveTitle(item)"
        >
          <div>{{ item.title }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.title"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Description -->
      <template v-slot:item.description="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.description"
          large
          @save="saveDescription(item)"
        >
          <div>{{ item.description }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.description"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.dissociate="{ item }" v-if="user.isStaff">
        <v-btn small text @click="dissociateProcedure(item)">
          <v-icon>
            cancel
          </v-icon>
        </v-btn>
      </template>

      <template v-slot:item.delete="{ item }" v-if="user.isStaff">
        <v-btn small text @click="deleteProcedure(item)">
          <v-icon>
            delete
          </v-icon>
        </v-btn>
      </template>

      <!-- Expand procedure events -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="pa-0 ma-0">
          <procedure-step-table :procedure="item" :showControls="false" />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ProcedureStepTable from '@/components/research/procedure-step-table.vue'
import ProcedureTableControls from '@/components/research/procedure-table-controls.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserTable',
  components: { ProcedureStepTable, ProcedureTableControls },
  props: { study: Object, showControls: { type: Boolean, default: true } },
  mounted() {
    if (this.user.isStaff && this.study) {
      this.headers.push(this.dissociateColumnHeader)
      this.headers.push(this.deleteColumnHeader)
    }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left', width: 1 },
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['title'],
      sortDesc: [false]
    },
    itemsPerPageOptions: [10, 20, 30],
    loading: false,
    expanded: [],
    expand: true,
    procedureDialog: false,
    chosenIndex: -1,
    dissociateColumnHeader: {
      text: 'Dissociate',
      value: 'dissociate',
      sortable: false,
      align: 'center',
      width: 1
    },
    deleteColumnHeader: {
      text: 'Delete',
      value: 'delete',
      sortable: false,
      align: 'center',
      width: 1
    }
  }),
  computed: {
    ...mapState('research', ['procedures', 'procedureCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    saveTitle(procedure) {
      let data = { procedureId: procedure.id, title: procedure.title }
      this.patchProcedure(data)
    },
    saveDescription(procedure) {
      let data = {
        procedureId: procedure.id,
        description: procedure.description
      }
      this.patchProcedure(data)
    },
    dissociateProcedure(procedure) {
      let procedures = this.study.procedures.filter(
        associatedProcedure => associatedProcedure != procedure.id
      )
      let data = { studyId: this.study.id, procedures }
      this.patchStudy(data).then(() => {
        this.$refs.controls.update()
      })
    },
    ...mapActions('research', [
      'deleteProcedure',
      'patchProcedure',
      'patchStudy'
    ])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.procedure-info {
  background-color: #dfe9fd;
}
</style>
