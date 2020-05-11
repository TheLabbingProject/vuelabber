<template>
  <div>
    <v-row class="px-3 pb-3">
      <div class="title text-left">Subjects</div>
      <v-spacer />
      <v-dialog v-model="createSubjectDialog" width="600px" v-if="currentUser.isStaff">
        <template v-slot:activator="{ on }">
          <v-btn color="success" v-on="on">New Subject</v-btn>
        </template>
        <subject-info-card
          :createMode="true"
          @close-subject-dialog="closeSubjectDialog(false)"
          :key="subjectDialog"
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
      :items="subjects"
      :loading="loading"
      :options.sync="options"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <subject-table-controls
          :options="options"
          @fetch-subjects-start="loading = true"
          @fetch-subjects-end="loading = false"
        />
      </template>
      <template v-slot:item.dateOfBirth="{ item }">{{ item.dateOfBirth | formatDate }}</template>
      <template v-slot:item.sex="{ item }">{{ sexOptions[item.sex] }}</template>
      <template v-slot:item.gender="{ item }">{{ genderOptions[item.gender] }}</template>
      <template v-slot:item.dominantHand="{ item }">{{ dominantHandOptions[item.dominantHand] }}</template>
      <template v-slot:item.edit="{ item }" v-if="currentUser.isStaff">
        <v-dialog v-model="editSubjectDialog[item.id]" width="600px">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">edit</v-icon>
          </template>
          <subject-info-card
            :existingSubject="item"
            @close-subject-dialog="
            
            
            
            (true, item)"
          />
        </v-dialog>
      </template>

      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="subject-data pa-0 ma-0">
          <subject-data :subject="item" />
          <hr />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import SubjectData from '@/components/research/subject-data.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import SubjectTableControls from '@/components/research/subject-table-controls.vue'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SubjectTable',
  components: {
    SubjectData,
    SubjectInfoCard,
    SubjectTableControls
  },
  created() {
    // Add edit column for staff users
    this.fetchUsers({ filters: {}, pagination: {} }).then(() =>
      this.appendEditColumn()
    )
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'First Name', value: 'firstName' },
      { text: 'Last Name', value: 'lastName' },
      { text: 'Date of Birth', value: 'dateOfBirth' },
      { text: 'Sex', value: 'sex' },
      { text: 'Gender', value: 'gender' },
      { text: 'Dominant Hand', value: 'dominantHand' }
    ],
    itemsPerPageOptions: [10, 25, 50, -1],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['id'],
      descending: true
    },
    loading: false,
    editSubjectDialog: {},
    expanded: [],
    sexOptions,
    genderOptions,
    dominantHandOptions,
    subjectDialog: false
  }),
  computed: {
    // ...mapState('research', ['subjects', 'selectedSubjectId']),
    ...mapState('research', ['subjects']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    closeSubjectDialog(updating, item) {
      if (updating) this.editSubjectDialog[item.id] = false
      else this.createSubjectDialog = false
      this.subjectDialog = !this.subjectDialog
    },
    appendEditColumn() {
      if (this.currentUser.isStaff) {
        this.headers.push({ text: 'Edit', value: 'edit' })
      }
    },
    ...mapActions('accounts', ['fetchUsers'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.subject-data {
  background-color: #dfe9fd;
}
</style>
