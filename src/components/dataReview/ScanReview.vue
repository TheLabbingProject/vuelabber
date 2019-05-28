<template>
  <div class="scan-review">
    <b-form class="scan-review" @submit.prevent="onSubmit">
      <b-form-group
        id="institution-name-input-group"
        label="Institution Name"
        label-for="institution-name-input"
        description="Where was this scanned acquired?"
      >
        <b-form-input
          id="institution-name-input"
          v-model="selectedSeries.institutionName"
          placeholder
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="acquisition-time-input-group"
        label="Acquisition Time"
        label-for="acquisition-time-input"
        description="When was this scanned acquired?"
      >
        <datetime
          input-id="acquisition-time-input"
          v-model="selectedSeries.time"
          type="datetime"
        ></datetime>
      </b-form-group>

      <b-form-group
        id="description-input-group"
        label="Description"
        label-for="description-input"
        description="A description of the type of scan acquired."
      >
        <b-form-input
          id="description-input"
          v-model="selectedSeries.description"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="number-input-group"
        label="Number"
        label-for="number-input"
        description="A number identifying this scan within its acquisition session."
      >
        <b-form-input
          id="number-input"
          v-model="selectedSeries.number"
          type="number"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="comments-input-group"
        label="Comments"
        label-for="comments-input"
        description="Anything noteworty about this scan or its acquisition."
      >
        <b-form-textarea
          id="comments-input"
          v-model="selectedSeries.comments"
        ></b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import axios from 'axios'
const camelcaseKeys = require('camelcase-keys')

export default {
  name: 'ScanReview',
  props: { selectedSeriesId: String },
  data: () => ({
    selectedSeries: {
      institutionName: '',
      time: '',
      description: '',
      number: null,
      comments: ''
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
          number: null,
          comments: ''
        }
      }
    },
    onSubmit() {
      return
    }
  },
  watch: {
    selectedSeriesId: function(newSeriesId) {
      this.getSelectedSeries(newSeriesId)
    },
    selectedSeries: function(newValue) {
      console.log(newValue)
    }
  }
}
</script>

<style scoped>
.scan-review label {
  text-align: left;
}
</style>
