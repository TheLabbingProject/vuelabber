<template>
  <div></div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SeriesTableControls',
  props: { pagination: Object, patient: Object },
  created() {
    this.fetchSequenceTypes()
    if (this.patient) this.filters.patientId = this.patient.id
    this.fetchSeries({ filters: this.filters, pagination: this.pagination })
  },
  data: () => ({
    filters: {
      id: '',
      uid: '',
      number: '',
      description: '',
      afterDate: '',
      beforeDate: '',
      patientId: ''
    }
  }),
  computed: {
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
