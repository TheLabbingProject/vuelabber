<template>
  <v-col>
    <patient-table-controls
      ref="tableController"
      :options="options"
      :studyId="studyId"
      @fetch-patients-start="loading = true"
      @fetch-patients-end="loading = false"
    />
    <v-data-table
      dense
      show-expand
      single-expand
      item-key="id"
      :expanded.sync="expanded"
      :headers="headers"
      :items="patients"
      :loading="loading"
      :options.sync="options"
      :server-items-length="patientCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:item.sex="{ item }">{{ getPatientSex(item) }}</template>
      <template v-slot:item.dateOfBirth="{ item }">{{
        item.dateOfBirth | formatDate
      }}</template>
      <template v-slot:item.subject="{ item }">
        <div class="py-1">
          <v-dialog v-model="subjectDialog[item.id]" width="400px">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                color="success"
                v-on="on"
                v-if="patientToSubject[item.id]"
                >Subject #{{ patientToSubject[item.id].id }}</v-btn
              >
              <v-btn v-else small color="warning" v-on="on" disabled
                >Create</v-btn
              >
            </template>
            <subject-info-card
              :existingSubject="patientToSubject[item.id]"
              :key="subjectDialog[item.id]"
              @close-subject-dialog="subjectDialog[item.id] = false"
            />
          </v-dialog>
        </div>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <series-table :patient="item"></series-table>
          <hr />
        </td>
      </template>
    </v-data-table>
  </v-col>
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
    expanded: [],
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
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['number'],
      descending: false
    },
    itemsPerPageOptions: [10, 25, 50, -1],
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
    ...mapMutations('dicom', ['setSelectedPatientId']),
    ...mapActions('research', ['fetchSubjects'])
  },
  watch: {
    patients: function(value) {
      value.forEach(patient => {
        this.fetchSubjects({
          filters: { dicomPatientId: patient.id },
          options: {}
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
