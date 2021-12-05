<template>
  <v-container fluid class="pa-2">
    <v-row>
      <div class="title text-left">
        {{ title }}
      </div>
      <v-spacer />
      <v-dialog v-model="createStudyDialog" width="600px" v-if="user.isStaff">
        <template v-slot:activator="{ on }">
          <v-btn color="success" v-on="on">
            {{ newStudyButtonText }}
          </v-btn>
        </template>
        <study-info-card
          :createMode="true"
          :key="studyDialog"
          @close-study-dialog="createStudyDialog = false"
          @created-study="update"
        />
      </v-dialog>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <v-data-table
          dense
          item-key="id"
          show-expand
          single-expand
          multi-sort
          :no-data-text="noDataText"
          :expanded.sync="expanded"
          :headers="computedHeaders"
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
              :loading="loading"
              :options="options"
              ref="controls"
              @fetch-studies-start="loading = true"
              @fetch-studies-end="loading = false"
              @fetch-study-aggregations-start="loading = true"
              @fetch-study-aggregations-end="loading = false"
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
          <template v-slot:[`item.title`]="{ item }" v-if="user.isStaff">
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
          <template v-slot:[`item.description`]="{ item }" v-if="user.isStaff">
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

          <template v-if="actionPermissions" v-slot:[`item.remove`]="{ item }">
            <v-icon small @click="showDeleteStudyDialog(item)">
              mdi-delete
            </v-icon>
          </template>

          <template v-slot:expanded-item="{ item, headers }">
            <td :colspan="headers.length" class="study-info pa-0 ma-0">
              <study-info :study="item" />
              <hr />
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
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
  data: () => ({
    title: 'Studies',
    newStudyButtonText: 'New Study',
    headers: [
      { text: 'Title', value: 'title', align: 'left' },
      { text: 'Description', value: 'description', align: 'left' },
      {
        text: '# Collaborators',
        value: 'collaborators.length',
        align: 'center'
      },
      {
        text: '# Procedures',
        value: 'procedures.length',
        align: 'center'
      },
      {
        text: '# Subjects',
        value: 'nSubjects',
        align: 'center'
      }
    ],
    actionsHeader: {
      text: 'Remove',
      value: 'remove',
      sortable: false,
      width: 100,
      align: 'center'
    },
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
    chosenIndex: -1,
    noDataText:
      'No studies found! Make sure you are a registered as a collaborator to make studies available to your account.'
  }),
  computed: {
    actionPermissions: function() {
      return this.checkActionPermissions(this.user)
    },
    computedHeaders: function() {
      if (this.actionPermissions) {
        return [...this.headers, this.actionsHeader]
      }
      return this.headers
    },
    ...mapState('research', ['studies', 'studyCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    checkActionPermissions(user) {
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
