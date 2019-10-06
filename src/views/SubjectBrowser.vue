<template>
  <v-layout column>
    <bokeh-vue :plot="plot" />
    <v-flex grow p-2>
      <v-layout column>
        <subject-table />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import BokehVue from '@/components/BokehVue.vue'
import SubjectTable from '@/components/research/subject-table.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SubjectBrowser',
  components: { BokehVue, SubjectTable },
  mounted() {
    this.fetchPlot().then(({ data }) => (this.plot = data))
  },
  data: () => ({
    plot: null
  }),
  computed: {
    ...mapState('research', ['selectedSubjectId'])
  },
  methods: {
    ...mapActions('mri', ['fetchPlot'])
  }
}
</script>

<style scoped></style>
