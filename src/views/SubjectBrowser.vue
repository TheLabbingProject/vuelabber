<template>
  <v-layout column>
<<<<<<< HEAD
    <bokeh-vue v-if="plot" :plot="plot" />
=======
    <bokeh-vue :plot="plot" />
>>>>>>> d2a18162fa99ce7a124ec379497559076c517386
    <v-flex grow p-2>
      <v-layout column>
        <subject-table />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
<<<<<<< HEAD
import BokehVue from 'bokeh-vue'
=======
import BokehVue from '@/components/BokehVue.vue'
>>>>>>> d2a18162fa99ce7a124ec379497559076c517386
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
