<template>
  <v-layout column>
    <v-flex xs5 p-2 v-if="selectedSubjectId">
      <subject-info />
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
import SubjectInfo from '@/components/research/subject-info.vue'
import SubjectTable from '@/components/research/subject-table.vue'
import { mapState } from 'vuex'

export default {
  name: 'SubjectBrowser',
  components: { SubjectInfo, SubjectTable },
  // data: () => ({

  // }),
  computed: {
    ...mapState('research', ['selectedSubjectId'])
  }
}
</script>

<style lang="scss" scoped></style>
