<template>
  <div>
    <v-layout row pl-3 pb-3 v-if="currentUserIsStaff">
      <div class="title text-left">Subjects</div>
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
    </v-layout>
    <subject-table-controls
      :pagination="pagination"
      @fetch-subjects-start="loading = true"
      @fetch-subjects-end="loading = false"
    />
    <v-flex>
      <v-data-table
        item-key="id"
        :expand="expand"
        :headers="headers"
        :items="subjects"
        :loading="loading"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
      >
        <template v-slot:items="props">
          <tr
            @click="selectSubject(props)"
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
              {{ props.item.dateOfBirth | formatDate }}
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
                width="400px"
                lazy
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
        <template v-slot:expand="props">
          <v-flex class="embeded-table" px-2 py-2>
            <subject-data />
            <hr />
          </v-flex>
        </template>
      </v-data-table>
    </v-flex>
  </div>
</template>

<script>
import SubjectData from '@/components/research/subject-data.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import SubjectTableControls from '@/components/research/subject-table-controls.vue'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { getKeyByValue } from './utils.js'
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'

export default {
  name: 'SubjectTable',
  components: {
    SubjectData,
    SubjectInfoCard,
    SubjectTableControls
  },
  created() {
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
      sortBy: 'id',
      descending: true
    },
    expand: false,
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
    appendEditColumn() {
      if (this.currentUserIsStaff) {
        this.headers.push({ text: 'Edit', value: 'editSubject' })
      }
    },
    selectSubject(props) {
      props.expanded = !props.expanded
      props.expanded
        ? this.setSelectedSubjectId(props.item.id)
        : this.setSelectedSubjectId(null)
    },
    ...mapActions('accounts', ['fetchProfiles']),
    ...mapMutations('research', ['setSelectedSubjectId'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #b3d4fc77;
}
div.embeded-table {
  background-color: white;
}
</style>
