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
        :expand="expand"
        :headers="headers"
        :items="patients"
        :loading="loading"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
      >
        <template v-slot:items="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-left" style="width: 50px;">
              {{ props.item.id }}
            </td>
            <td class="text-xs-left">
              {{ props.item.uid }}
            </td>
            <td class="text-xs-left">
              {{ props.item.givenName }}
            </td>
            <td class="text-xs-left">
              {{ props.item.familyName }}
            </td>
            <td class="text-xs-left">
              {{ getPatientSex(props.item) }}
            </td>
            <td class="text-xs-left">
              {{ formatDate(props.item.dateOfBirth) }}
            </td>
            <td class="text-xs-right">
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
                    v-if="patientToSubject[props.item.id]"
                  >
                    Subject #{{ patientToSubject[props.item.id].id }}
                  </v-btn>
                  <v-btn v-else small color="warning" v-on="on" disabled>
                    Create
                  </v-btn>
                </template>
                <subject-info-card
                  :existingSubject="patientToSubject[props.item.id]"
                  :key="subjectDialog[props.item.id]"
                  @close-subject-dialog="subjectDialog[props.item.id] = false"
                />
              </v-dialog>
            </td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-flex pl-4 py-4>
            <series-table :patient="props.item"></series-table>
            <hr />
          </v-flex>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import PatientTableControls from './patient-table-controls.vue'
import SeriesTable from './series-table.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapGetters, mapState, mapActions } from 'vuex'
import { getKeyByValue } from '@/utils'
import { sexOptions } from './utils'

export default {
  name: 'PatientTable',
  components: { PatientTableControls, SeriesTable, SubjectInfoCard },
  data: () => ({
    subjectDialog: {},
    patientToSubject: {},
    expand: false,
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'Patient UID', value: 'uid' },
      { text: 'First Name', value: 'givenName' },
      { text: 'Last Name', value: 'familyName' },
      { text: 'Sex', value: 'sex' },
      { text: 'Date of Birth', value: 'dateOfBirth' },
      {
        text: 'Research Subject',
        value: 'subject',
        align: 'right',
        width: '50px'
      }
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
    ...mapActions('research', ['fetchSubjectByDicomPatientId'])
  },
  watch: {
    patients: function(value) {
      value.forEach(patient => {
        this.fetchSubjectByDicomPatientId(patient.id).then(subject =>
          this.$set(this.patientToSubject, patient.id, subject)
        )
      })
    }
  }
}
</script>

<style scoped>
td {
  vertical-align: middle;
}
</style>
