<template>
  <div>
    <v-row class="align-center">
      <!-- Study Description -->
      <v-col>
        <v-text-field
          label="Study Description"
          type="text"
          v-model="filters.studyDescription"
        />
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
        <!-- Sequence Name -->
        <v-text-field
          label="Sequence Name"
          type="text"
          v-model="filters.sequenceName"
        />
      </v-col>
      <v-col>
        <!-- Pulse Sequence Name -->
        <v-text-field
          label="Pulse Sequence Name"
          type="text"
          v-model="filters.pulseSequenceName"
        />
      </v-col>
      <v-col>
        <!-- Manufacturer -->
        <v-select
          chips
          multiple
          label="Maunfacturer"
          v-model="filters.manufacturer"
          :items="manufacturersList"
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
      <!-- Echo Time -->
      <v-col>
        <v-text-field
          label="Echo Time Min"
          type="number"
          v-model="filters.echoTime.min"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Echo Time Max"
          type="number"
          v-model="filters.echoTime.max"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
      <!-- Slice Thickness -->
      <v-col>
        <v-text-field
          label="Slice Thickness Min"
          type="number"
          v-model="filters.sliceThickness.min"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Slice Thickness Max"
          type="number"
          v-model="filters.sliceThickness.max"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
      <v-col>
        <!-- Pixel Spacing -->
        <v-text-field
          label="Pixel Spacing Min"
          type="number"
          v-model="filters.pixelSpacing.min"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
      <v-col>
        <!-- Pixel Spacing -->
        <v-text-field
          label="Pixel Spacing Max"
          type="number"
          v-model="filters.pixelSpacing.max"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
    </v-row>
    <v-row>
      <!-- Inversion Time -->
      <v-col>
        <v-text-field
          label="Inversion Time Min"
          type="number"
          v-model="filters.inversionTime.min"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Inversion Time Max"
          type="number"
          v-model="filters.inversionTime.max"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
      <!-- Repetition Time -->
      <v-col>
        <v-text-field
          label="Repetition Time Min"
          type="number"
          v-model="filters.repetitionTime.min"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Repetition Time Max"
          type="number"
          v-model="filters.repetitionTime.max"
          @change="updateCounter()"
          cols="1"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Header Fields -->
        <v-text-field
          label="Header Fields"
          v-model="headerFieldsData"
          @keyup.enter="updateHeaderFields()"
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
    this.fetchManufacturers()
    if (this.patient) this.filters.patientId = this.patient.id
    this.update()
  },
  data: () => ({
    filters: {
      id: null,
      uid: null,
      number: null,
      description: null,
      studyDescription: null,
      afterDate: null,
      beforeDate: null,
      afterTime: null,
      beforeTime: null,
      patientId: null,
      headerFields: null,
      manufacturer: null,
      pulseSequenceName: null,
      sequenceName: null,
      echoTime: {},
      pixelSpacing: {},
      sliceThickness: {},
      inversionTime: {},
      repetitionTime: {},
      sequenceVariant: null,
      scanningSequence: null
    },
    headerFieldsData: null,
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
    ...mapState('dicom', ['seriesList', 'manufacturersList'])
  },
  methods: {
    update() {
      this.$emit('fetch-series-start')
      this.filters.headerFields = this.headerFieldsData
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
    updateCounter() {
      this.counter++
    },
    ...mapActions('dicom', ['fetchSeries', 'fetchManufacturers']),
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
    },
    counter: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
