<template>
  <v-layout column>
    <v-flex grow p-2>
      <v-layout column>
        <subject-table />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import SubjectTable from '@/components/research/subject-table.vue'
import { mapState } from 'vuex'

export default {
  name: 'SubjectBrowser',
  components: { SubjectTable },
  // data: () => ({

  // }),
  computed: {
    ...mapState('research', ['selectedSubjectId'])
  }
}
</script>

<style scoped></style>
