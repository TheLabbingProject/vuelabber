<template>
  <v-layout column>
    <patient-table-controls
      ref="tableController"
      :pagination="pagination"
      @fetch-patients-start="loading = true"
      @fetch-patients-end="loading = false"
    />
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
        <tr
          @click="selectPatient(props)"
          :class="{ selected: props.item.id === selectedPatientId }"
        >
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
            <v-dialog v-model="subjectDialog[props.item.id]" lazy width="800px">
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
        <v-flex class="embeded-table" px-2 py-2>
          <series-table :patient="props.item"></series-table>
          <hr />
        </v-flex>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import PatientTableControls from './patient-table-controls.vue'
import SeriesTable from './series-table.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
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
      sortBy: 'id',
      descending: false
    },
    loading: false,
    sexOptions
  }),
  computed: {
    ...mapState('dicom', ['patients', 'selectedPatientId']),
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
    selectPatient(props) {
      props.expanded = !props.expanded
      props.expanded
        ? this.setSelectedPatientId(props.item.id)
        : this.setSelectedPatientId(null)
    },
    ...mapMutations('dicom', ['setSelectedPatientId']),
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
>>> tr.selected {
  background-color: #b3d4fc77;
}
div.embeded-table {
  background-color: #b3d4fc77;
}
</style>
