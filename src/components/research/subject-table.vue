<template>
  <div>
    <v-row class="px-3 pb-3">
      <div class="title text-left">
        Subjects
      </div>
      <v-spacer />
      <v-dialog
        v-model="createSubjectDialog"
        width="600px"
        v-if="currentUser.isStaff"
      >
        <template v-slot:activator="{ on }">
          <v-btn color="success" v-on="on">
            New Subject
          </v-btn>
        </template>
        <subject-info-card
          :createMode="true"
          @close-subject-dialog="createSubjectDialog = false"
        />
      </v-dialog>
    </v-row>
    <subject-table-controls
      :pagination="options"
      @fetch-subjects-start="loading = true"
      @fetch-subjects-end="loading = false"
    />
    <v-flex>
      <v-data-table
        item-key="id"
        :headers="headers"
        :items="subjects"
        :loading="loading"
        :options.sync="options"
        :items-per-page-options="rowsPerPageItems"
      >
        <template v-slot:item.dateOfBirth="{ item }">
          {{ item.dateOfBirth | formatDate }}
        </template>
        <template v-slot:item.sex="{ item }">
          {{ sexOptions[item.sex] }}
        </template>
        <template v-slot:item.gender="{ item }">
          {{ genderOptions[item.gender] }}
        </template>
        <template v-slot:item.dominantHand="{ item }">
          {{ dominantHandOptions[item.dominantHand] }}
        </template>
        <!-- <td
          v-if="currentUser.isStaff"
          class="text-xs-left"
          style="width: 50px;"
        >
          <v-dialog v-model="editSubjectDialog[props.item.id]" width="600px">
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">
                edit
              </v-icon>
            </template>
            <subject-info-card
              :existingSubject="props.item"
              @close-subject-dialog="editSubjectDialog[props.item.id] = false"
            />
          </v-dialog>
        </td> -->

        <!-- <template v-slot:expand="props">
          <v-flex class="embeded-table" px-2 py-2>
            <subject-data />
            <hr />
          </v-flex>
        </template> -->
      </v-data-table>
    </v-flex>
  </div>
</template>

<script>
// import SubjectData from '@/components/research/subject-data.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import SubjectTableControls from '@/components/research/subject-table-controls.vue'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'SubjectTable',
  components: {
    // SubjectData,
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
    rowsPerPageItems: [
      10,
      25,
      50,
      { text: '$vuetify.dataIterator.rowsPerPageAll', value: 100000 }
    ],
    options: {
      rowsPerPage: 100,
      page: 1,
      sortBy: ['id'],
      descending: true
    },
    loading: false,
    createSubjectDialog: false,
    editSubjectDialog: {},
    sexOptions,
    genderOptions,
    dominantHandOptions
  }),
  computed: {
    ...mapState('research', ['subjects', 'selectedSubjectId']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    appendEditColumn() {
      if (this.currentUser.isStaff) {
        this.headers.push({ text: 'Edit', value: 'editSubject' })
      }
    },
    selectSubject(props) {
      props.expanded = !props.expanded
      props.expanded
        ? this.setSelectedSubjectId(props.item.id)
        : this.setSelectedSubjectId(null)
    },
    ...mapActions('accounts', ['fetchUsers']),
    ...mapMutations('research', ['setSelectedSubjectId'])
  }
}
</script>

<style scoped>
>>> tr.selected {
  background-color: #e4f3ff;
}
div.embeded-table {
  background-color: #e4f3ff;
}
</style>
