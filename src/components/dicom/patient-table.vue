<template>
  <v-layout column>
    <v-flex align-start>
      <div class="text-xs-left font-italic display-1 pl-3 pb-3">
        DICOM Patients
      </div>
    </v-flex>
    <v-flex><hr /></v-flex>
    <v-flex>
      <v-data-table
        :rows-per-page-items="[
          10,
          25,
          50,
          { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
        ]"
        :headers="headers"
        :items="patients"
        :expand="expand"
        item-key="id"
      >
        <template v-slot:items="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.id }}</td>
            <td class="text-xs-left">{{ props.item.uid }}</td>
            <td class="text-xs-left">{{ props.item.givenName }}</td>
            <td class="text-xs-left">{{ props.item.familyName }}</td>
            <td class="text-xs-left">{{ sexOptions[props.item.sex] }}</td>
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
                    Review
                  </v-btn>
                </template>
                <subject-info-card
                  :existingSubject="getSubjectByUrl(props.item.subject)"
                  :key="subjectDialog[props.item.id]"
                  @close-subject-dialog="subjectDialog[props.item.id] = false"
                  @associate-patient="associateSubject(props.item, $event)"
                  @disassociate-patient="disassociateSubject(props.item)"
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
import SeriesTable from './series-table.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'PatientTable',
  created() {
    this.$store.dispatch('dicom/fetchPatients')
    this.$store.dispatch('research/fetchSubjects')
  },
  components: { SeriesTable, SubjectInfoCard },
  data: () => ({
    subjectDialog: {},
    sexOptions: { M: 'Male', F: 'Female', I: 'Intersex' },
    expand: false,
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'UID', value: 'uid' },
      { text: 'First Name', value: 'givenName' },
      { text: 'Last Name', value: 'familyName' },
      { text: 'Sex', value: 'sex' },
      { text: 'Date of Birth', value: 'dateOfBirth' },
      { text: 'Research Subject', value: 'subject' }
    ],
    tempSeriesList: null
  }),
  computed: {
    ...mapState('dicom', ['patients']),
    ...mapGetters('research', ['getSubjectByUrl'])
  },
  methods: {
    associateSubject: function(patient, subject) {
      patient.subject = subject.url
      this.updatePatient(patient)
      delete this.subjectDialog[patient.id]
    },
    disassociateSubject: function(patient) {
      patient.subject = null
      this.updatePatient(patient)
    },
    formatDate: function(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    ...mapActions('dicom', ['updatePatient'])
  }
}
</script>

<style lang="scss" scoped>
td {
  vertical-align: middle;
}
</style>
