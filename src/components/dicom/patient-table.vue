<template>
  <v-col>
    <patient-table-controls
      ref="controls"
      :options="options"
      :loading="loading"
      :studyId="studyId"
      @fetch-patients-start="loading = true"
      @fetch-patients-end="loading = false"
      @fetch-patient-aggregations-start="loading = true"
      @fetch-patient-aggregations-end="loading = false"
    />
    <v-data-table
      dense
      multi-sort
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
      <!-- Sex -->
      <template v-slot:[`item.sex`]="{ item }"
        >{{ getPatientSex(item) }}
      </template>

      <!-- Date of Birth -->
      <template v-slot:[`item.dateOfBirth`]="{ item }">
        {{ item.dateOfBirth | formatDate }}
      </template>

      <!-- Latest Study Time -->
      <template v-slot:[`item.latestStudyTime`]="{ item }">
        {{ item.latestStudyTime | formatDateTime }}
      </template>

      <!-- Research Subject -->
      <template v-slot:[`item.subject`]="{ item }">
        <div class="py-1">
          <v-dialog v-model="subjectDialog[item.id]" width="400px">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                color="success"
                v-on="on"
                v-if="item.researchSubject"
              >
                Subject #{{ item.researchSubject }}
              </v-btn>
              <v-btn v-else small color="warning" v-on="on" disabled>
                Create
              </v-btn>
            </template>
            <subject-info-card
              :subjectId="item.researchSubject"
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
      { text: 'UID', value: 'uid', align: 'center' },
      { text: 'Last Name', value: 'familyName', align: 'left' },
      { text: 'First Name', value: 'givenName', align: 'left' },
      { text: 'Sex', value: 'sex', align: 'center' },
      {
        text: 'Date of Birth',
        value: 'dateOfBirth',
        align: 'center'
      },
      {
        text: 'Latest Session',
        value: 'latestStudyTime',
        align: 'center'
      },
      {
        text: '# Sessions',
        value: 'nStudies',
        align: 'center',
        width: 120,
        sortable: false
      },
      {
        text: '# Scans',
        value: 'nSeries',
        align: 'center',
        width: 120,
        sortable: false
      },
      {
        text: '# Images',
        value: 'nImages',
        align: 'center',
        width: 120,
        sortable: false
      },
      {
        text: 'Research Subject',
        value: 'subject',
        width: '50px',
        sortable: false,
        align: 'center'
      }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['latestStudyTime'],
      sortDesc: [true]
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
