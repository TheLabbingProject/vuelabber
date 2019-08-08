<template>
  <v-layout column>
    <v-flex row pl-3>
      <div class="title text-left pb-3">Subjects</div>
      <v-spacer />
      <v-dialog v-model="createSubjectDialog" lazy width="400px">
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
    </v-flex>
    <subject-table-controls
      :pagination="pagination"
      @fetch-subjects-start="loading = true"
      @fetch-subjects-end="loading = false"
    />
    <v-flex>
      <v-data-table
        item-key="id"
        :headers="headers"
        :items="subjects"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
      >
        <template v-slot:items="props">
          <tr
            @click="setSelectedSubjectId(props.item.id)"
            :class="{ selected: props.item.id === selectedSubjectId }"
          >
            <td class="text-xs-left" style="width: 50px;">
              {{ props.item.id }}
            </td>

            <td class="text-xs-left">
              {{ props.item.firstName }}
            </td>
            <td class="text-xs-left">
              {{ props.item.lastName }}
            </td>
            <td class="text-xs-left">
              {{ formatDate(props.item.dateOfBirth) }}
            </td>
            <td class="text-xs-left">
              {{ getSubjectSexDisplay(props.item) }}
            </td>
            <td class="text-xs-left">
              {{ getSubjectGenderDisplay(props.item) }}
            </td>
            <td class="text-xs-left">
              {{ getSubjectDominantHandDisplay(props.item) }}
            </td>
            <td
              v-if="currentUserIsStaff"
              class="text-xs-left"
              style="width: 50px;"
            >
              <v-dialog
                v-model="editSubjectDialog[props.item.id]"
                lazy
                width="400px"
              >
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">
                    edit
                  </v-icon>
                </template>
                <subject-info-card
                  :existingSubject="props.item"
                  @close-subject-dialog="
                    editSubjectDialog[props.item.id] = false
                  "
                />
              </v-dialog>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import SubjectTableControls from '@/components/research/subject-table-controls.vue'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { getKeyByValue } from './utils.js'

export default {
  name: 'SubjectTable',
  components: {
    SubjectInfoCard,
    SubjectTableControls
  },
  created() {
    this.fetchSubjects({ filters: this.filters, pagination: this.pagination })

    // Add edit column for staff users
    this.fetchProfiles().then(() => this.appendEditColumn())
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'First Name', value: 'givenName' },
      { text: 'Last Name', value: 'familyName' },
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
    pagination: {
      rowsPerPage: 100,
      page: 1,
      ordering: 'id',
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
    ...mapGetters('accounts', ['currentUserIsStaff'])
  },
  methods: {
    getSubjectSexDisplay: function(subject) {
      return getKeyByValue(this.sexOptions, subject.sex)
    },
    getSubjectGenderDisplay: function(subject) {
      return getKeyByValue(this.genderOptions, subject.gender)
    },
    getSubjectDominantHandDisplay: function(subject) {
      return getKeyByValue(this.dominantHandOptions, subject.dominantHand)
    },
    formatDate(date) {
      if (!date) return null
      let [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    appendEditColumn() {
      if (this.currentUserIsStaff) {
        this.headers.push({ text: 'Edit', value: 'editSubject' })
      }
    },
    ...mapActions('research', ['fetchSubjects']),
    ...mapActions('accounts', ['fetchProfiles']),
    ...mapMutations('research', ['setSelectedSubjectId'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #b3d4fc77;
}
</style>
