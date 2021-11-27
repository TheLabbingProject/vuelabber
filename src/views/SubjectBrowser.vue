<template>
  <v-container fluid class="pt-2 px-0">
    <v-col class="py-0">
      <v-row>
        <div class="title text-left">
          {{ title }}
        </div>
        <v-spacer />
        <v-dialog
          v-model="createSubjectDialog"
          width="600px"
          v-if="currentUser.isStaff"
        >
          <template v-slot:activator="{ on }">
            <v-btn :color="newSubjectButton.color" v-on="on">
              {{ newSubjectButton.label }}
            </v-btn>
          </template>
          <subject-info-card
            @close-subject-dialog="createSubjectDialog = false"
          />
        </v-dialog>
      </v-row>
      <v-row>
        <subject-table />
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import SubjectTable from '@/components/research/subject-table.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapState } from 'vuex'

export default {
  name: 'SubjectBrowser',
  components: { SubjectTable, SubjectInfoCard },
  data: () => ({
    title: 'Subjects',
    createSubjectDialog: false,
    newSubjectButton: { label: 'New Subject', color: 'success' },
    subjectDialog: false
  }),
  computed: {
    ...mapState('auth', { currentUser: 'user' })
  }
}
</script>

<style scoped></style>
