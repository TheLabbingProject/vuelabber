<template>
  <v-layout column>
    <v-flex row pl-3>
      <div class="title text-left pb-3">Subjects</div>
      <v-spacer />
      <v-dialog v-model="createSubjectDialog" lazy width="800px">
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
    <subject-table-controls />
    <v-flex>
      <v-data-table
        item-key="id"
        :headers="headers"
        :items="subjects"
        :rows-per-page-items="rowsPerPageItems"
      >
        <template v-slot:items="props">
          <tr
            @click="setSelectedSubjectId(props.item.id)"
            :class="{ selected: props.item.id === selectedSubjectId }"
          >
            <td class="text-xs-left">
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
            <td class="text-xs-left">
              <v-dialog
                v-model="editSubjectDialog[props.item.id]"
                lazy
                width="800px"
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
import { mapActions, mapMutations, mapState } from 'vuex'
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
    this.fetchSubjects()
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'First Name', value: 'givenName' },
      { text: 'Last Name', value: 'familyName' },
      { text: 'Date of Birth', value: 'dateOfBirth' },
      { text: 'Sex', value: 'sex' },
      { text: 'Gender', value: 'gender' },
      { text: 'Dominant Hand', value: 'dominantHand' },
      { text: 'Edit', value: 'editSubject' }
    ],
    rowsPerPageItems: [
      10,
      25,
      50,
      { text: '$vuetify.dataIterator.rowsPerPageAll', value: 100000 }
    ],
    createSubjectDialog: false,
    editSubjectDialog: {},
    sexOptions,
    genderOptions,
    dominantHandOptions
  }),
  computed: {
    ...mapState('research', ['subjects', 'selectedSubjectId'])
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
    ...mapActions('research', ['fetchSubjects']),
    ...mapMutations('research', ['setSelectedSubjectId'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #b3d4fc77;
}
</style>
