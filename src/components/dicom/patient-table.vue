<template>
  <v-layout column>
    <v-flex row px-5>
      <v-text-field label="ID" v-model="filters.id" />
      <v-spacer />
      <v-text-field
        label="Patient UID"
        v-model="filters.uid"
        :disabled="Boolean(filters.id)"
      />
      <v-spacer />
      <v-text-field
        label="First Name"
        v-model="filters.firstName"
        :disabled="Boolean(filters.id)"
      />
      <v-spacer />
      <v-text-field
        label="Last Name"
        v-model="filters.lastName"
        :disabled="Boolean(filters.id)"
      />
      <v-spacer />
      <v-select
        label="Sex"
        v-model="filters.sex"
        clearable
        :disabled="Boolean(filters.id)"
        :items="Object.keys(sexOptions)"
      />
      <v-flex>
        <v-menu
          v-model="bornAfterMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="filters.bornAfter"
              label="Born After"
              prepend-icon="event"
              readonly
              v-on="on"
              :disabled="Boolean(filters.id)"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.bornAfter"
            @input="bornAfterMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex>
        <v-menu
          v-model="bornBeforeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="filters.bornBefore"
              label="Born Before"
              prepend-icon="event"
              readonly
              v-on="on"
              :disabled="Boolean(filters.id)"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.bornBefore"
            @input="bornBeforeMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-flex>
    </v-flex>
    <v-flex>
      <v-data-table
        item-key="id"
        :rows-per-page-items="[
          10,
          25,
          50,
          { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
        ]"
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
    this.fetchPatients()
    this.fetchSubjects()
  },
  components: { SeriesTable, SubjectInfoCard },
  data: () => ({
    subjectDialog: {},
    sexOptions: { Male: 'M', Female: 'F', Other: 'O' },
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
    filters: {
      id: '',
      uid: '',
      firstName: '',
      lastName: '',
      sex: '',
      bornAfter: '',
      bornBefore: ''
    },
    bornAfterMenu: false,
    bornBeforeMenu: false
  }),
  computed: {
    ...mapState('dicom', ['patients']),
    ...mapGetters('research', ['getSubjectByUrl'])
  },
  methods: {
    getPatientSex: function(patient) {
      return getKeyByValue(this.sexOptions, patient.sex)
    },
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
    addIdFilterString: function(filterString) {
      if (this.filters.id) {
        filterString += `id=${this.filters.id}`
      }
      return filterString
    },
    addUidFilterString: function(filterString) {
      if (this.filters.uid) {
        filterString += `uid=${this.filters.uid}&uid_lookup=icontains`
        if (
          this.filters.firstName ||
          this.filters.lastName ||
          this.filters.sex ||
          this.filters.bornAfter ||
          this.filters.bornBefore
        ) {
          filterString += '&'
        }
      }
      return filterString
    },
    addFirstNameFilterString: function(filterString) {
      if (this.filters.firstName) {
        filterString += `given_name=${
          this.filters.firstName
        }&given_name_lookup=icontains`
        if (
          this.filters.lastName ||
          this.filters.sex ||
          this.filters.bornAfter ||
          this.filters.bornBefore
        ) {
          filterString += '&'
        }
      }
      return filterString
    },
    addLastNameFilterString: function(filterString) {
      if (this.filters.lastName) {
        filterString += `family_name=${
          this.filters.lastName
        }&family_name_lookup=icontains`
      }
      if (
        this.filters.sex ||
        this.filters.bornAfter ||
        this.filters.bornBefore
      ) {
        filterString += '&'
      }
      return filterString
    },
    addSexFilterString: function(filterString) {
      if (this.filters.sex) {
        filterString += `sex=${this.sexOptions[this.filters.sex]}`
      }
      if (this.filters.bornAfter || this.filters.bornBefore) {
        filterString += '&'
      }
      return filterString
    },
    addBornAfterFilterString: function(filterString) {
      if (this.filters.bornAfter) {
        filterString += `born_after_date=${this.filters.bornAfter}`
      }
      if (this.filters.bornBefore) {
        filterString += '&'
      }
      return filterString
    },
    addBornBeforeFilterString: function(filterString) {
      if (this.filters.bornBefore) {
        filterString += `born_before_date=${this.filters.bornBefore}`
      }
      return filterString
    },
    createFilterString: function() {
      let filterString = ''
      if (this.filters.id) {
        filterString = this.addIdFilterString(filterString)
        return filterString
      }
      filterString = this.addUidFilterString(filterString)
      filterString = this.addFirstNameFilterString(filterString)
      filterString = this.addLastNameFilterString(filterString)
      filterString = this.addSexFilterString(filterString)
      filterString = this.addBornAfterFilterString(filterString)
      filterString = this.addBornBeforeFilterString(filterString)
      return filterString
    },
    ...mapActions('dicom', [
      'fetchPatients',
      'updatePatient',
      'filterPatients'
    ]),
    ...mapActions('research', ['fetchSubjects'])
  },
  watch: {
    filters: {
      handler(newValue) {
        let filterString = this.createFilterString(newValue)
        this.filterPatients(filterString)
      },
      deep: true
    }
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}
</script>

<style lang="scss" scoped>
td {
  vertical-align: middle;
}
</style>
