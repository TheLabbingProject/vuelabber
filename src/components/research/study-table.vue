<template>
  <div>
    <v-row class="pa-5">
      <div class="title text-left">Studies</div>
      <v-spacer />
      <v-dialog v-model="createStudyDialog" width="600px" v-if="user.isStaff">
        <template v-slot:activator="{ on }">
          <v-btn color="success" v-on="on">New Study</v-btn>
        </template>
        <study-info-card
          :createMode="true"
          :key="studyDialog"
          @close-study-dialog="createStudyDialog = false"
          @created-study="update"
        />
      </v-dialog>
    </v-row>
    <v-data-table
      dense
      item-key="id"
      show-expand
      single-expand
      :expanded.sync="expanded"
      :headers="headers"
      :items="studies"
      :loading="loading"
      :options.sync="options"
      :server-items-length="studyCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <study-table-controls
          :options="options"
          ref="controls"
          @fetch-studies-start="loading = true"
          @fetch-studies-end="loading = false"
        />
        <v-dialog v-model="deleteStudyDialog" max-width="500px">
          <v-card>
            <v-card-title class="h4">
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDeleteDialog">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteStudyConfirm">
                OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- Title -->
      <template v-slot:item.title="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.title"
          large
          persistent
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
          persistent
          @save="saveDescription(item)"
        >
          <div>{{ item.description }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.description"
              label="Edit"
              multi-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-if="actionPermissions" v-slot:item.actions="{ item }">
        <v-icon small @click="showDeleteStudyDialog(item)"> mdi-delete </v-icon>
      </template>

      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="study-info pa-0 ma-0">
          <study-info :study="item" />
          <hr />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import StudyInfo from '@/components/research/study-info.vue'
import StudyInfoCard from '@/components/research/study-info-card.vue'
import StudyTableControls from '@/components/research/study-table-controls.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'StudyTable',
  components: {
    StudyInfo,
    StudyInfoCard,
    StudyTableControls
  },
  mounted() {
    if (this.actionPermissions) {
      this.headers.push(this.actionsHeader)
    }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left', width: 1 },
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' }
    ],
    actionsHeader: { text: 'Actions', value: 'actions', sortable: false },
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['title'],
      sortDesc: [false]
    },
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false,
    expanded: [],
    expand: true,
    studyDialog: false,
    createStudyDialog: false,
    deleteStudyDialog: false,
    chosenIndex: -1
  }),
  computed: {
    actionPermissions: function() {
      return this.checkActionsPermissions(this.user)
    },
    ...mapState('research', ['studies', 'studyCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    checkActionsPermissions(user) {
      return user.isStaff || user.isSuperuser
    },
    showDeleteStudyDialog(item) {
      this.chosenIndex = this.studies.indexOf(item)
      this.deleteStudyDialog = true
    },

    deleteStudyConfirm() {
      let study = this.studies[this.chosenIndex]
      this.deleteStudy(study).then(() => {
        this.closeDeleteDialog()
      })
    },

    closeDeleteDialog() {
      this.deleteStudyDialog = false
      this.$nextTick(() => {
        this.chosenIndex = -1
      })
    },
    saveTitle(study) {
      let data = { id: study.id, title: study.title }
      this.patchStudy(data)
    },
    saveDescription(study) {
      let data = { id: study.id, description: study.description }
      this.patchStudy(data)
    },
    update() {
      this.$refs['controls'].update()
    },
    ...mapActions('research', ['deleteStudy', 'patchStudy'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.study-info {
  background-color: #dfe9fd;
}
</style>
