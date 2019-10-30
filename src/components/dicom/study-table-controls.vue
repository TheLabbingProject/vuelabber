<template>
  <div></div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'StudyTableControls',
  props: {
    options: Object
  },
  created() {
    this.update()
  },
  data: () => ({
    filters: {
      id: null,
      description: null,
      beforeDate: null,
      afterDate: null,
      beforeTime: null,
      afterTime: null,
      uid: null
    }
  }),
  methods: {
    update() {
      this.$emit('fetch-studies-start')
      this.fetchStudies({ filters: this.filters, options: this.options })
      this.$emit('fetch-studies-end')
    },
    ...mapActions('dicom', ['fetchStudies'])
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
