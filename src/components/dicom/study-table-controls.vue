<template>
  <v-container>
    <v-row>
      <!-- <v-col>
        <v-text-field
          v-model="studyUidFilter.value"
          :disabled="loading"
          :hint="studyUidFilter.hint"
          :label="studyUidFilter.label"
        ></v-text-field>
      </v-col> -->
      <v-col>
        <v-text-field
          v-model="studyDescriptionFilter.value"
          :disabled="loading"
          :hint="studyDescriptionFilter.hint"
          :label="studyDescriptionFilter.label"
        ></v-text-field>
      </v-col>
      <!-- Date -->
      <v-col cols="3">
        <v-row class="align-center">
          <v-col>
            <v-menu v-model="afterDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="afterDateFilter.value"
                  :disabled="loading"
                  v-on="on"
                  clearable
                  readonly
                  :label="afterDateFilter.label"
                  :prepend-icon="afterDateFilter.prependIcon"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="afterDateFilter.value"
                @input="afterDateMenu = false"
              ></v-date-picker>
            </v-menu> </v-col
          >-
          <v-col>
            <v-menu v-model="beforeDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="beforeDateFilter.value"
                  :disabled="loading"
                  v-on="on"
                  clearable
                  readonly
                  :label="beforeDateFilter.label"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="beforeDateFilter.value"
                @input="beforeDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>

      <!-- Time -->
      <v-col cols="3">
        <v-row class="align-center">
          <v-col>
            <v-menu v-model="afterTimeMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="afterTimeFilter.value"
                  v-on="on"
                  clearable
                  readonly
                  :disabled="loading"
                  :label="afterTimeFilter.label"
                  :prepend-icon="afterTimeFilter.prependIcon"
                />
              </template>
              <v-time-picker
                format="24hr"
                v-model="afterTimeFilter.value"
                @input="afterTimeMenu = false"
              />
            </v-menu> </v-col
          >-
          <v-col>
            <v-menu v-model="beforeTimeMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="beforeTimeFilter.value"
                  v-on="on"
                  clearable
                  readonly
                  :disabled="loading"
                  :label="beforeTimeFilter.label"
                />
              </template>
              <v-time-picker
                format="24hr"
                v-model="beforeTimeFilter.value"
                @input="beforeTimeMenu = false"
              />
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="studyAggregations">
      <v-col>
        <v-row>
          <v-range-slider
            v-model="nPatientsRangeFilter.value"
            hide-details
            :label="nPatientsRangeFilter.label"
            :max="studyAggregations.nPatientsMax"
            :min="studyAggregations.nPatientsMin"
            :disabled="loading"
            :loading="aggregationsLoading"
          >
            <template v-slot:prepend>
              <v-text-field
                :disabled="loading"
                :value="nPatientsRangeFilter.value[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nPatientsRangeFilter.value, 0, $event)"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :disabled="loading"
                :value="nPatientsRangeFilter.value[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nPatientsRangeFilter.value, 1, $event)"
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-row>
        <v-row>
          <v-range-slider
            v-model="nSeriesRangeFilter.value"
            hide-details
            :label="nSeriesRangeFilter.label"
            :max="studyAggregations.nSeriesMax"
            :min="studyAggregations.nSeriesMin"
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
            :max="studyAggregations.nImagesMax"
            :min="studyAggregations.nImagesMin"
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
import { camelToSnake } from '@/utils'

export default {
  name: 'StudyTableControls',
  props: {
    loading: Boolean,
    options: Object
  },
  mounted() {
    this.updateStudyAggregations()
  },
  data: () => ({
    aggregationsLoading: false,
    aggregationsFetched: false,
    afterDateMenu: false,
    beforeDateMenu: false,
    afterTimeMenu: false,
    beforeTimeMenu: false,
    studyUidFilter: {
      hint: 'Unique identifier for the Study.',
      label: 'Study UID',
      value: ''
    },
    studyDescriptionFilter: {
      hint:
        'Institution-generated description or classification of the Study (component) performed.',
      label: 'Study Description',
      value: ''
    },
    afterDateFilter: {
      label: 'After Date',
      prependIcon: 'event',
      value: ''
    },
    beforeDateFilter: {
      label: 'Before Date',
      value: ''
    },
    afterTimeFilter: {
      label: 'After Time',
      prependIcon: 'clock',
      value: ''
    },
    beforeTimeFilter: {
      label: 'Before Time',
      value: ''
    },
    nPatientsRangeFilter: {
      hint: 'Filter by the number of patients associated with this study.',
      label: 'Number of patients',
      value: [0, 1]
    },
    nSeriesRangeFilter: {
      hint: 'Filter by the number of series associated with this study.',
      label: 'Number of series',
      value: [0, 1]
    },
    nImagesRangeFilter: {
      hint: 'Filter by the number of images associated with this study.',
      label: 'Number of images',
      value: [0, 1]
    }
  }),
  computed: {
    filters: function() {
      return {
        description: this.studyDescriptionFilter.value,
        beforeDate: this.beforeDateFilter.value,
        afterDate: this.afterDateFilter.value,
        beforeTime: this.beforeTimeFilter.value,
        afterTime: this.afterTimeFilter.value,
        uid: this.studyUidFilter.value,
        nPatientsMin: this.nPatientsRangeFilter.value[0],
        nPatientsMax: this.nPatientsRangeFilter.value[1],
        nSeriesMin: this.nSeriesRangeFilter.value[0],
        nSeriesMax: this.nSeriesRangeFilter.value[1],
        nImagesMin: this.nImagesRangeFilter.value[0],
        nImagesMax: this.nImagesRangeFilter.value[1]
      }
    },
    snakeOptions: function() {
      let options = Object.assign({}, this.options)
      options.sortBy = options.sortBy.map(value => camelToSnake(value))
      return options
    },
    ...mapState('dicom', ['studyAggregations'])
  },
  methods: {
    update() {
      if (this.aggregationsFetched) {
        this.$emit('fetch-studies-start')
        this.fetchStudies({
          filters: this.filters,
          options: this.snakeOptions
        }).then(() => this.$emit('fetch-studies-end'))
      }
    },
    updateStudyAggregations() {
      this.$emit('fetch-study-aggregations-start')
      this.aggregationsLoading = true
      this.fetchStudyAggregations().then(() => {
        this.nPatientsRangeFilter.value = [
          this.studyAggregations.nPatientsMin,
          this.studyAggregations.nPatientsMax
        ]
        this.nSeriesRangeFilter.value = [
          this.studyAggregations.nSeriesMin,
          this.studyAggregations.nSeriesMax
        ]
        this.nImagesRangeFilter.value = [
          this.studyAggregations.nImagesMin,
          this.studyAggregations.nImagesMax
        ]
        this.aggregationsLoading = false
        this.aggregationsFetched = true
        this.$emit('fetch-study-aggregations-end')
      })
    },
    ...mapActions('dicom', ['fetchStudies', 'fetchStudyAggregations'])
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
