<template>
  <v-layout column>
    <patient-table-controls
      ref="tableController"
      :pagination="pagination"
      @fetch-patients-start="loading = true"
      @fetch-patients-end="loading = false"
    />
    <v-flex>
      <v-data-table
        item-key="id"
        :rows-per-page-items="rowsPerPageItems"
        :headers="headers"
        :items="patients"
        :expand="expand"
      >
        <template v-slot:items="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.id }}</td>
            <td class="text-xs-left">{{ props.item.uid }}</td>
            <td class="text-xs-left">{{ props.item.givenName }}</td>
            <td class="text-xs-left">{{ props.item.familyName }}</td>
            <td class="text-xs-left">{{ getPatientSex(props.item) }}</td>
            <td class="text-xs-left">
              {{ formatDate(props.item.dateOfBirth) }}
            </td>
            <td class="text-xs-left">
              <v-dialog
                v-model="subjectDialog[props.item.id]"
                lazy
                width="800px"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    color="success"
                    v-on="on"
                    v-if="getSubjectByUrl(props.item.subject)"
                  >
                    Subject #{{ getSubjectByUrl(props.item.subject).id }}
                  </v-btn>
                  <v-btn v-else small color="warning" v-on="on">
                    Create
                  </v-btn>
                </template>
                <subject-info-card
                  :existingSubject="getSubjectByUrl(props.item.subject)"
                  :key="subjectDialog[props.item.id]"
                  @close-subject-dialog="subjectDialog[props.item.id] = false"
                />
              </v-dialog>
            </td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat>
            <series-table :patient="props.item"></series-table>
          </v-card>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import PatientTableControls from './patient-table-controls.vue'
import SeriesTable from './series-table.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapGetters, mapState } from 'vuex'
import { getKeyByValue } from '@/utils'
import { sexOptions } from './utils'

export default {
  name: 'PatientTable',
  // created() {
  //   this.fetchSubjects()
  // },
  components: { PatientTableControls, SeriesTable, SubjectInfoCard },
  data: () => ({
    subjectDialog: {},
    expand: false,
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'Patient UID', value: 'uid' },
      { text: 'First Name', value: 'givenName' },
      { text: 'Last Name', value: 'familyName' },
      { text: 'Sex', value: 'sex' },
      { text: 'Date of Birth', value: 'dateOfBirth' },
      { text: 'Research Subject', value: 'subject' }
    ],
    rowsPerPageItems: [
      10,
      25,
      50,
      { text: '$vuetify.dataIterator.rowsPerPageAll', value: 100000 }
    ],
    pagination: {
      rowsPerPage: 25,
      page: 1,
      ordering: 'id',
      descending: false
    },
    loading: false,
    sexOptions
  }),
  computed: {
    ...mapState('dicom', ['patients']),
    ...mapGetters('research', ['getSubjectByUrl'])
  },
  methods: {
    getPatientSex: function(patient) {
      return getKeyByValue(this.sexOptions, patient.sex)
    },
    formatDate: function(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    update() {
      this.$refs.tableController.update()
    }
  }
}
</script>

<style scoped>
td {
  vertical-align: middle;
}
</style>
