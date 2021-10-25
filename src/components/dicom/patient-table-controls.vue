<template>
  <v-container>
    <v-row class="px-5">
      <!-- Patient UID -->
      <v-col>
        <v-text-field
          :label="uidFilter.label"
          v-model="uidFilter.value"
          autofocus
        />
      </v-col>

      <!-- First Name -->
      <v-col>
        <v-text-field
          :label="firstNameFilter.label"
          v-model="firstNameFilter.value"
        />
      </v-col>

      <!-- Last Name -->
      <v-col>
        <v-text-field
          :label="lastNameFilter.label"
          v-model="lastNameFilter.value"
        />
      </v-col>

      <!-- Sex -->
      <v-col>
        <v-select
          clearable
          :label="sexFilter.label"
          v-model="sexFilter.value"
          :items="Object.keys(sexOptions)"
        />
      </v-col>

      <v-col cols="3">
        <v-row class="align-center">
          <v-col>
            <v-menu v-model="bornAfterMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable
                  readonly
                  :label="bornAfterFilter.label"
                  prepend-icon="event"
                  v-model="bornAfterFilter.value"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="bornAfterFilter.value"
                @input="bornAfterMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          -
          <v-col>
            <v-menu v-model="bornBeforeMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable
                  readonly
                  :label="bornBeforeFilter.label"
                  v-model="bornBeforeFilter.value"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="bornBeforeFilter.value"
                @input="bornBeforeMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="patientAggregations">
      <v-col>
        <v-row>
          <v-range-slider
            v-model="nStudiesRangeFilter.value"
            hide-details
            :label="nStudiesRangeFilter.label"
            :max="patientAggregations.nStudiesMax"
            :min="patientAggregations.nStudiesMin"
            :disabled="loading"
            :loading="aggregationsLoading"
          >
            <template v-slot:prepend>
              <v-text-field
                :disabled="loading"
                :value="nStudiesRangeFilter.value[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nStudiesRangeFilter.value, 0, $event)"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :disabled="loading"
                :value="nStudiesRangeFilter.value[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nStudiesRangeFilter.value, 1, $event)"
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-row>
        <v-row>
          <v-range-slider
            v-model="nSeriesRangeFilter.value"
            hide-details
            :label="nSeriesRangeFilter.label"
            :max="patientAggregations.nSeriesMax"
            :min="patientAggregations.nSeriesMin"
            :disabled="loading"
            :loading="aggregationsLoading"
          >
            <template v-slot:prepend>
              <v-text-field
                :disabled="loading"
                :value="nSeriesRangeFilter.value[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nSeriesRangeFilter.value, 0, $event)"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :disabled="loading"
                :value="nSeriesRangeFilter.value[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nSeriesRangeFilter.value, 1, $event)"
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-row>
        <v-row>
          <v-range-slider
            v-model="nImagesRangeFilter.value"
            hide-details
            :disabled="loading"
            :label="nImagesRangeFilter.label"
            :max="patientAggregations.nImagesMax"
            :min="patientAggregations.nImagesMin"
            :loading="aggregationsLoading"
          >
            <template v-slot:prepend>
              <v-text-field
                :disabled="loading"
                :value="nImagesRangeFilter.value[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nImagesRangeFilter.value, 0, $event)"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :disabled="loading"
                :value="nImagesRangeFilter.value[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nImagesRangeFilter.value, 1, $event)"
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { sexOptions } from './utils'
import { camelToSnake } from '@/utils'

export default {
  name: 'PatientTableControls',
  props: {
    options: Object,
    studyId: { type: Number, default: 0 },
    loading: Boolean
  },
  created() {
    this.updatePatientAggregations()
  },
  data: () => ({
    bornAfterMenu: false,
    bornBeforeMenu: false,
    sexOptions,
    uidFilter: {
      label: 'UID',
      value: ''
    },
    firstNameFilter: {
      label: 'First Name',
      value: ''
    },
    lastNameFilter: {
      label: 'Last Name',
      value: ''
    },
    sexFilter: {
      label: 'Sex',
      value: ''
    },
    bornAfterFilter: {
      label: 'Born After',
      value: ''
    },
    bornBeforeFilter: {
      label: 'Born Before',
      value: ''
    },
    nStudiesRangeFilter: {
      hint: 'Filter by the number of studies associated with this patient.',
      label: 'Number of studies',
      value: [0, 1]
    },
    nSeriesRangeFilter: {
      hint: 'Filter by the number of series associated with this patient.',
      label: 'Number of series',
      value: [0, 1]
    },
    nImagesRangeFilter: {
      hint: 'Filter by the number of images associated with this patient.',
      label: 'Number of images',
      value: [0, 1]
    },
    aggregationsLoading: false
  }),
  computed: {
    filters: function() {
      return {
        uid: this.uidFilter.value,
        bornAfter: this.bornAfterFilter.value,
        afterDate: this.bornBeforeFilter.value,
        nStudiesMin: this.nStudiesRangeFilter.value[0],
        nStudiesMax: this.nStudiesRangeFilter.value[1],
        nSeriesMin: this.nSeriesRangeFilter.value[0],
        nSeriesMax: this.nSeriesRangeFilter.value[1],
        nImagesMin: this.nImagesRangeFilter.value[0],
        nImagesMax: this.nImagesRangeFilter.value[1],
        studyId: this.studyId
      }
    },
    snakeOptions: function() {
      let options = Object.assign({}, this.options)
      options.sortBy = options.sortBy.map(value => camelToSnake(value))
      return options
    },
    ...mapState('dicom', ['patientAggregations'])
  },
  methods: {
    update() {
      this.$emit('fetch-patients-start')
      this.fetchPatients({
        filters: this.filters,
        options: this.snakeOptions
      }).then(() => this.$emit('fetch-patients-end'))
    },
    updatePatientAggregations() {
      this.$emit('fetch-patient-aggregations-start')
      this.aggregationsLoading = true
      this.fetchPatientAggregations().then(() => {
        this.nStudiesRangeFilter.value = [
          this.patientAggregations.nStudiesMin,
          this.patientAggregations.nStudiesMax
        ]
        this.nSeriesRangeFilter.value = [
          this.patientAggregations.nSeriesMin,
          this.patientAggregations.nSeriesMax
        ]
        this.nImagesRangeFilter.value = [
          this.patientAggregations.nImagesMin,
          this.patientAggregations.nImagesMax
        ]
        this.aggregationsLoading = false
        this.aggregationsFetched = true
        this.$emit('fetch-patient-aggregations-end')
      })
    },
    ...mapActions('dicom', ['fetchPatients', 'fetchPatientAggregations'])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    options: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
