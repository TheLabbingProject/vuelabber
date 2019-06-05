<template>
  <div>
    <patientInformation :patient="selectedPatient"></patientInformation>
    <h3>Series Information</h3>
    <v-form class="scan-review" @submit.prevent="onSubmit">
      <v-layout row wrap>
        <v-text-field
          v-model="selectedSeries.institutionName"
          id="institution-name-input"
          type="text"
          label="Institution Name"
          hint="Where was this scan acquired?"
        />
      </v-layout>
      <v-layout row wrap>
        <v-text-field
          v-model="selectedSeries.description"
          id="description-input"
          type="text"
          label="Description"
          hint="A description of the type of scan acquired."
        />
        <v-spacer />
        <v-text-field
          v-model="selectedSeries.sequenceType.title"
          id="sequence-type-input"
          type="text"
          label="Sequence Type"
          hint="A unique combination of scanning sequence and variant."
          readonly
        />
      </v-layout>

      <v-layout row wrap>
        <v-flex>
          <v-menu
            v-model="dateMenu"
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
                v-model="seriesDate"
                label="Acquisition Date"
                prepend-icon="event"
                disabled
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="seriesDate"
              @input="dateMenu = false"
              :max="new Date().toISOString().substr(0, 10)"
              readonly
            />
          </v-menu>
        </v-flex>
        <v-spacer />
        <v-flex pl-3>
          <v-menu
            ref="timeMenuRef"
            v-model="timeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="seriesTime"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="seriesTime"
                label="Acquisition Time"
                prepend-icon="access_time"
                disabled
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="timeMenu"
              v-model="seriesTime"
              format="24hr"
              @click:minute="$refs.timeMenuRef.save(time)"
              use-seconds
              full-width
              disabled
            />
          </v-menu>
        </v-flex>
        <v-spacer />
        <v-flex pl-3>
          <v-text-field
            v-model="selectedSeries.number"
            id="number-input"
            type="number"
            label="Acquisition Number"
            hint="A number identifying this scan within its acquisition session."
            disabled
          />
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-textarea
          name="comments-input"
          label="Comments"
          value=""
          hint="Anything noteworty about this scan or its acquisition."
        />
      </v-layout>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios'
import patientInformation from '../dicom/patient-information'
const camelcaseKeys = require('camelcase-keys')

export default {
  name: 'ScanReview',
  props: { selectedSeriesId: String },
  components: { patientInformation },
  data: () => ({
    dateMenu: null,
    timeMenu: null,
    selectedSeries: {
      institutionName: '',
      time: '',
      description: '',
      sequenceType: { title: '' },
      number: null,
      comments: ''
    },
    selectedPatientId: null,
    selectedPatient: {
      uid: '',
      dateOfBirth: '',
      sex: '',
      givenName: '',
      familyName: '',
      middleName: '',
      namePrefix: '',
      nameSuffix: ''
    }
  }),
  methods: {
    getSelectedSeries(selectedSeriesId) {
      if (selectedSeriesId && selectedSeriesId.startsWith('dicom_series_')) {
        let seriesId = selectedSeriesId.split('_').pop()
        axios
          .get('/api/mri/scan/from_dicom/' + seriesId)
          .then(({ data }) => (this.selectedSeries = camelcaseKeys(data)))
          .catch(console.error)
      } else {
        return {
          institutionName: '',
          time: '',
          description: '',
          sequenceType: { title: '' },
          number: null,
          comments: ''
        }
      }
    },
    getSelectedPatient(selectedSeries) {
      if (selectedSeries) {
        axios
          .get('/api/dicom/patients/18/')
          .then(({ data }) => (this.selectedPatient = camelcaseKeys(data)))
          .catch(console.error)
      } else {
        return {
          uid: '',
          dateOfBirth: '',
          sex: '',
          givenName: '',
          familyName: '',
          middleName: '',
          namePrefix: '',
          nameSuffix: ''
        }
      }
    },
    onSubmit() {
      return
    }
  },
  computed: {
    seriesDate: function() {
      if (this.selectedSeries.time) {
        let date = new Date(this.selectedSeries.time)
          .toISOString()
          .substr(0, 10)
        return date
      } else {
        return null
      }
    },
    seriesTime: function() {
      if (this.selectedSeries.time) {
        let time = new Date(this.selectedSeries.time).toISOString().substr(11)
        return time
      } else {
        return null
      }
    }
  },
  watch: {
    selectedSeriesId: function(newSeriesId) {
      this.getSelectedSeries(newSeriesId)
    },
    selectedSeries: function(newSeries) {
      this.getSelectedPatient(newSeries)
    }
  }
}
</script>

<style scoped>
/deep/ label.col-form-label {
  text-align: left;
}
/deep/ .form-text {
  text-align: left;
}
</style>
