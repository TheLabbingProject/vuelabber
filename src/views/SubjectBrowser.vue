<template>
  <v-col>
    <!-- <bokeh-vue :plot="plot" /> -->
    <subject-table />
  </v-col>
</template>

<script>
// import BokehVue from '@/components/BokehVue.vue'
import SubjectTable from '@/components/research/subject-table.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SubjectBrowser',
  // components: { BokehVue, SubjectTable },
  components: { SubjectTable },
  mounted() {
    // this.fetchPlot().then(({ data }) => (this.plot = data))
  },
  data: () => ({
    plot: { div: [], script: [] }
  }),
  computed: {
    // ...mapState('research', ['selectedSubjectId'])
  },
  methods: {
    ...mapActions('mri', ['fetchPlot'])
  }
}
</script>

<style scoped></style>
