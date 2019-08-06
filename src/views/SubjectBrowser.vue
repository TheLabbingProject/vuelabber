<template>
  <v-layout column>
    <v-flex xs5 p-2 v-if="selectedSubjectId">
      <subject-data />
      <br />
      <hr />
      <br />
    </v-flex>
    <v-flex grow p-2>
      <v-layout column>
        <subject-table />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import SubjectData from '@/components/research/subject-data.vue'
import SubjectTable from '@/components/research/subject-table.vue'
import { mapState } from 'vuex'

export default {
  name: 'SubjectBrowser',
  components: { SubjectData, SubjectTable },
  // data: () => ({

  // }),
  computed: {
    ...mapState('research', ['selectedSubjectId'])
  }
}
</script>

<style scoped></style>
