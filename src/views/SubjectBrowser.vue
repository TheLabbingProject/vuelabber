<template>
  <v-col>
    <v-row class="px-3 pb-3">
      <div class="title text-left">
        Subjects
      </div>
      <v-spacer />
      <v-dialog
        v-model="createSubjectDialog"
        width="600px"
        v-if="currentUser.isStaff"
      >
        <template v-slot:activator="{ on }">
          <v-btn color="success" v-on="on">
            New Subject
          </v-btn>
        </template>
        <subject-info-card
          :createMode="true"
          @close-subject-dialog="createSubjectDialog = false"
        />
      </v-dialog>
    </v-row>
    <subject-table />
  </v-col>
</template>

<script>
import SubjectTable from '@/components/research/subject-table.vue'
import { mapState } from 'vuex'

export default {
  name: 'SubjectBrowser',
  components: { SubjectTable },
  data: () => ({
    createSubjectDialog: false
  }),
  computed: {
    ...mapState('research', ['selectedSubjectId', 'plots']),
    ...mapState('auth', { currentUser: 'user' })
  }
}
</script>

<style scoped></style>
