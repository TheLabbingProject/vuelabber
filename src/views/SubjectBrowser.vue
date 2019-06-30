<template>
  <v-layout column>
    <v-flex xs5 p-2 v-if="selectedSubjectId">
      <subject-info />
    </v-flex>
    <v-flex grow p-2>
      <v-layout column>
        <v-dialog v-model="createSubjectDialog" lazy width="800px">
          <template v-slot:activator="{ on }">
            <v-btn small color="warning" v-on="on">
              Create
            </v-btn>
          </template>
          <subject-info-card
            createMode="true"
            @close-subject-dialog="createSubjectDialog = false"
          />
        </v-dialog>
        <subject-table />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import SubjectInfo from '@/components/research/subject-info.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import SubjectTable from '@/components/research/subject-table.vue'
import { mapState } from 'vuex'

export default {
  name: 'SubjectBrowser',
  components: { SubjectInfo, SubjectInfoCard, SubjectTable },
  data: () => ({
    createSubjectDialog: false
  }),
  computed: {
    ...mapState('research', ['selectedSubjectId'])
  }
}
</script>

<style lang="scss" scoped></style>
