<template>
  <v-layout column pb-5>
    <patient-table-controls
      ref="tableController"
      :pagination="pagination"
      :studyId="studyId"
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
      :rows-per-page-items="pagination.rowsPerPageItems"
      :total-items="patientCount"
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
            {{ props.item.dateOfBirth | formatDate }}
          </td>
          <td class="text-xs-right">
            <v-dialog v-model="subjectDialog[props.item.id]" lazy width="400px">
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
import { mapState, mapActions, mapMutations } from 'vuex'
import { getKeyByValue } from '@/utils'
import { sexOptions } from './utils'

export default {
  name: 'PatientTable',
  components: { PatientTableControls, SeriesTable, SubjectInfoCard },
  props: { studyId: Number },
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
      { text: 'Date of Birth', value: 'dateOfBirth', sortable: false },
      {
        text: 'Research Subject',
        value: 'subject',
        width: '50px',
        sortable: false
      }
    ],
    pagination: {
      rowsPerPage: 25,
      page: 1,
      sortBy: 'number',
      descending: false,
      rowsPerPageItems: [
        10,
        25,
        50,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: 100000 }
      ]
    },
    loading: false,
    sexOptions
  }),
  computed: {
    ...mapState('dicom', ['patients', 'patientCount', 'selectedPatientId'])
  },
  methods: {
    getPatientSex: function(patient) {
      return getKeyByValue(this.sexOptions, patient.sex)
    },
    selectPatient(props) {
      props.expanded = !props.expanded
      props.expanded
        ? this.setSelectedPatientId(props.item.id)
        : this.setSelectedPatientId(null)
    },
    ...mapMutations('dicom', ['setSelectedPatientId']),
    ...mapActions('research', ['fetchSubjects'])
  },
  watch: {
    patients: function(value) {
      value.forEach(patient => {
        this.fetchSubjects({
          filters: { dicomPatientId: patient.id },
          pagination: {}
        }).then(results =>
          this.$set(this.patientToSubject, patient.id, results[0])
        )
      })
    }
  }
}
</script>

<style scoped>
>>> tr.selected {
  background-color: #ffebee;
}
div.embeded-table {
  background-color: #e3f2fd;
}
</style>
