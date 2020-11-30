<template>
  <div>
    <v-row class="px-5 align-center justify-space-between">
      <!-- Lab -->
      <v-col cols="1">
        <v-text-field
          label="Lab"
          type="text"
          v-model="headerFieldsSplitData['StudyDescription']"
          @blur="
            searchHeaderField(
              'StudyDescription',
              headerFieldsSplitData['StudyDescription']
            )
          "
        />
      </v-col>

      <!-- Description -->
      <v-col cols="2">
        <v-text-field label="Description" v-model="filters.description" />
      </v-col>

      <!-- Date -->
      <v-col cols="4">
        <v-row class="align-center">
          <v-col>
            <v-menu v-model="afterDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable
                  readonly
                  label="After Date"
                  prepend-icon="event"
                  v-model="filters.afterDate"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.afterDate"
                @input="afterDateMenu = false"
              ></v-date-picker>
            </v-menu> </v-col
          >-
          <v-col>
            <v-menu v-model="beforeDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable
                  readonly
                  label="Before Date"
                  prepend-icon="event"
                  v-model="filters.beforeDate"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.beforeDate"
                @input="beforeDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>

      <!-- Time -->
      <v-col cols="4">
        <v-row class="align-center">
          <v-col>
            <v-menu v-model="afterTimeMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable
                  readonly
                  label="After Time"
                  prepend-icon="access_time"
                  v-model="filters.afterTime"
                  v-on="on"
                />
              </template>
              <v-time-picker
                format="24hr"
                v-model="filters.afterTime"
                @input="afterTimeMenu = false"
              />
            </v-menu> </v-col
          >-
          <v-col>
            <v-menu v-model="beforeTimeMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable
                  readonly
                  label="Before Time"
                  prepend-icon="access_time"
                  v-model="filters.beforeTime"
                  v-on="on"
                />
              </template>
              <v-time-picker
                format="24hr"
                v-model="filters.beforeTime"
                @input="beforeTimeMenu = false"
              />
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Slice Thickness"
          type="number"
          v-model="filters.sliceThickess"
          cols="2"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Pixel Spacing"
          v-model="pixelSpacingData"
          @blur="filters.pixelSpacing = pixelSpacingData"
          cols="2"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Maunfacturer"
          v-model="filters.manufacturer"
          cols="2"
        />
      </v-col>
      <v-col>
        <!-- Scanning Sequence -->
        <v-select
          chips
          multiple
          label="Scanning Sequence"
          v-model="filters.scanningSequence"
          :items="scanningSequenceItems"
        />
      </v-col>
      <v-col>
        <!-- Sequence Variants -->
        <v-select
          chips
          multiple
          label="Sequence Variants"
          v-model="filters.sequenceVariant"
          :items="sequenceVariantItems"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Header Fields"
          v-model="headerFieldsData"
          @keyup.enter="filters.headerFields = headerFieldsData"
          cols="2"
        />
      </v-col>
      <v-col cols="1">
        <v-btn
          class="ma-2 success"
          :loading="loadingCSV"
          :disabled="loadingCSV"
          @click="getCSVWrapper()"
        >
          To CSV
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { scanningSequences, sequenceVariants } from '@/components/mri/utils'

export default {
  name: 'SeriesTableControls',
  props: { options: Object, patient: Object },
  created() {
    this.fetchSequenceTypes()
    if (this.patient) this.filters.patientId = this.patient.id
    this.update()
  },
  data: () => ({
    filters: {
      id: null,
      uid: null,
      number: null,
      description: null,
      afterDate: null,
      beforeDate: null,
      afterTime: null,
      beforeTime: null,
      patientId: null,
      manufacturer: null,
      sliceThickess: null,
      pixelSpacing: null,
      headerFields: null,
      sequenceVariant: null,
      scanningSequence: null
    },
    headerFieldsData: null,
    headerFieldsSplitData: {},
    pixelSpacingData: null,
    counter: 0,
    loadingCSV: false,
    afterDateMenu: false,
    beforeDateMenu: false,
    afterTimeMenu: false,
    beforeTimeMenu: false,
    scanningSequenceItems: Object.keys(scanningSequences),
    sequenceVariantItems: Object.keys(sequenceVariants)
  }),
  computed: {
    dates: function() {
      let rawDates = [...new Set(this.seriesList.map(series => series.date))]
      return rawDates.map(date => this.$options.filters.formatDate(date))
    },
    headerFieldCount() {
      return this.counter
    },
    ...mapState('dicom', ['seriesList'])
  },
  methods: {
    update() {
      this.$emit('fetch-series-start')
      this.fetchSeries({
        filters: this.filters,
        options: this.options
      }).then(() =>
        this.fetchScans({
          filters: { dicomIdIn: this.seriesList.map(series => series.id) },
          options: this.options
        })
      )
      this.$emit('fetch-series-end')
    },
    getCSVWrapper() {
      this.loadingCSV = true
      var dicomIds = this.seriesList.map(series => series.id)
      this.getCSV(dicomIds).then(() => (this.loadingCSV = false))
    },
    searchHeaderField(field, value) {
      if (this.filters.headerFields == null) this.filters.headerFields = {}
      if (!(field in this.filters.headerFields)) {
        this.filters.headerFields[field] = [value]
      } else {
        this.filters.headerFields[field].append(value)
      }
    },
    ...mapActions('dicom', ['fetchSeries']),
    ...mapActions('mri', ['fetchSequenceTypes', 'fetchScans', 'getCSV'])
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

<style lang="scss" scoped></style>
