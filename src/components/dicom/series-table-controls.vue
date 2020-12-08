<template>
  <div>
    <v-row class="px-5 align-center">
      <!-- Lab -->
      <v-col cols="2">
        <v-text-field
          label="Lab"
          type="text"
          v-model="headerFieldsSplitData['LabName']"
          @change="addToHeaderField('StudyDescription', 'LabName')"
        />
      </v-col>

      <!-- Researcher Name -->
      <v-col cols="2">
        <v-text-field
          label="Researcher"
          type="text"
          v-model="headerFieldsSplitData['ResearcherName']"
          @change="addToHeaderField('StudyDescription', 'ResearcherName')"
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
        <!-- SequenceName -->
        <v-text-field
          label="Sequence Name"
          type="text"
          v-model="headerFieldsSplitData['SequenceName']"
          @change="addToHeaderField('(0018, 0024)', 'SequenceName')"
        />
      </v-col>
      <v-col>
        <!-- PulseSequenceName -->
        <v-text-field
          label="Pulse Sequence Name"
          type="text"
          v-model="headerFieldsSplitData['PulseSequenceName']"
          @change="addToHeaderField('(0019, 109E)', 'PulseSequenceName')"
        />
      </v-col>
      <v-col>
        <!-- Manufacturer -->
        <v-select
          chips
          multiple
          label="Maunfacturer"
          v-model="filters.manufacturer"
          :items="manufacturerItems"
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
        <!-- Echo Time -->
        <v-text-field
          label="Echo Time"
          type="number"
          v-model="filters.echoTime"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-select
          label="Op"
          v-model="filters.operators.echoTime"
          :items="numberOperatorsItems"
          cols="1"
        />
      </v-col>
      <v-col>
        <!-- Slice Thickness -->
        <v-text-field
          label="Slice Thickness"
          type="number"
          v-model="filters.sliceThickess"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-select
          label="Op"
          v-model="filters.operators.sliceThickness"
          :items="numberOperatorsItems"
          cols="1"
        />
      </v-col>
      <v-col>
        <!-- Pixel Spacing -->
        <v-text-field
          label="Pixel Spacing"
          type="number"
          v-model="filters.pixelSpacing"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-select
          label="Op"
          v-model="filters.operators.pixelSpacing"
          :items="numberOperatorsItems"
          cols="1"
        />
      </v-col>
      <v-col>
        <!-- Inversion Time -->
        <v-text-field
          label="Inversion Time"
          type="number"
          v-model="filters.inversionTime"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-select
          label="Op"
          v-model="filters.operators.inversionTime"
          :items="numberOperatorsItems"
          cols="1"
        />
      </v-col>
      <v-col>
        <!-- Repetition Time -->
        <v-text-field
          label="Repetition Time"
          type="number"
          v-model="filters.repetitionTime"
          cols="1"
        />
      </v-col>
      <v-col>
        <v-select
          label="Op"
          v-model="filters.operators.repetitionTime"
          :items="numberOperatorsItems"
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
import { numberOperators } from '@/utils'

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
      headerFields: null,
      manufacturer: null,
      echoTime: null,
      pixelSpacing: null,
      sliceThickess: null,
      inversionTime: null,
      repetitionTime: null,
      sequenceVariant: null,
      scanningSequence: null,
      operators: {}
    },
    headerFieldsData: null,
    headerFieldsSplitData: {},
    counter: 0,
    loadingCSV: false,
    afterDateMenu: false,
    beforeDateMenu: false,
    afterTimeMenu: false,
    beforeTimeMenu: false,
    scanningSequenceItems: Object.keys(scanningSequences),
    sequenceVariantItems: Object.keys(sequenceVariants),
    numberOperatorsItems: numberOperators
  }),
  computed: {
    dates: function() {
      let rawDates = [...new Set(this.seriesList.map(series => series.date))]
      return rawDates.map(date => this.$options.filters.formatDate(date))
    },
    manufacturerItems() {
      return [...new Set(this.seriesList.map(series => series.manufacturer))]
    },
    ...mapState('dicom', ['seriesList'])
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
    addToHeaderField(to_field, from_field) {
      if (this.headerFieldsData == null) this.headerFieldsData = '{}'
      var header = JSON.parse(this.headerFieldsData)
      var value = this.headerFieldsSplitData[from_field]
      if (value.includes(',')) value = [...new Set(value.split(','))]
      if (value == '') {
        delete this.headerFieldsSplitData[from_field]
      } else if (to_field in header) {
        if (!(value in Object.values(header))) {
          header[to_field].push(value)
        }
      } else {
        header[to_field] = [value]
      }
      this.headerFieldsData = JSON.stringify(header)
      this.counter++
    },
    updateHeaderFields() {
      this.counter++
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
