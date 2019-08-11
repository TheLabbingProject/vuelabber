<template>
  <v-layout row px-3>
    <!-- Number -->
    <v-text-field
      label="Number"
      v-model="filters.number"
      style="width: 10px;"
    />
    <v-spacer />

    <!-- Description -->
    <v-text-field
      label="Description"
      v-model="filters.description"
      style="width: 120px;"
    />
    <v-spacer />

    <!-- Date -->
    <v-menu v-model="afterDateMenu" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-text-field
          clearable
          readonly
          label="After Date"
          prepend-icon="event"
          style="width: 120px;"
          v-model="filters.afterDate"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="filters.afterDate"
        @input="afterDateMenu = false"
      ></v-date-picker>
    </v-menu>
    <v-spacer />
    <v-menu v-model="beforeDateMenu" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-text-field
          clearable
          readonly
          label="Before Date"
          prepend-icon="event"
          style="width: 120px;"
          v-model="filters.beforeDate"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="filters.beforeDate"
        @input="beforeDateMenu = false"
      ></v-date-picker>
    </v-menu>
    <v-spacer />

    <!-- Time -->
    <v-menu v-model="afterTimeMenu" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-text-field
          clearable
          readonly
          label="After Time"
          prepend-icon="access_time"
          style="width: 120px;"
          v-model="filters.afterTime"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        format="24hr"
        v-model="filters.afterTime"
        @input="afterTimeMenu = false"
      ></v-time-picker>
    </v-menu>
    <v-spacer />
    <v-menu v-model="beforeTimeMenu" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-text-field
          clearable
          readonly
          label="Before Time"
          prepend-icon="access_time"
          style="width: 120px;"
          v-model="filters.beforeTime"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        format="24hr"
        v-model="filters.beforeTime"
        @input="beforeTimeMenu = false"
      ></v-time-picker>
    </v-menu>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SeriesTableControls',
  props: { pagination: Object, patient: Object },
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
      patientId: null
    },
    afterDateMenu: false,
    beforeDateMenu: false,
    afterTimeMenu: false,
    beforeTimeMenu: false
  }),
  computed: {
    dates: function() {
      let rawDates = [...new Set(this.seriesList.map(series => series.date))]
      return rawDates.map(date => this.$options.filters.formatDate(date))
    },
    ...mapState('dicom', ['seriesList'])
  },
  methods: {
    update() {
      this.$emit('fetch-series-start')
      this.fetchSeries({
        filters: this.filters,
        pagination: this.pagination
      }).then(() =>
        this.fetchScans({
          filters: { dicomIdIn: this.seriesList.map(series => series.id) },
          pagination: this.pagination
        })
      )
      this.$emit('fetch-series-end')
    },
    ...mapActions('dicom', ['fetchSeries']),
    ...mapActions('mri', ['fetchSequenceTypes', 'fetchScans'])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    pagination: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
