<template>
  <v-col>
    <!-- Create new study button -->
    <div v-if="currentUser">
      <v-row v-if="currentUser.isStaff" class="px-2">
        <v-spacer />
        <v-col cols="1">
          <v-dialog v-model="createStudyDialog" width="400px">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="info">New Study</v-btn>
            </template>
            <study-info-card @close-study-dialog="closeStudyDialog(false)" :key="studyDialog" />
          </v-dialog>
        </v-col>
      </v-row>
    </div>

    <!-- Existing study card -->
    <div v-if="currentUser">
      <v-card class="mb-4 mx-2" v-for="study in filteredStudies" :key="study.id">
        <!-- Title -->
        <v-card-title class="title purple darken-2 white--text">
          <span>{{ study.title }}</span>
          <v-spacer />
          <!-- Edit study dialog button -->
          <v-dialog v-model="editStudyDialog[study.id]" width="400px">
            <template v-slot:activator="{ on }">
              <v-icon v-if="currentUser.isStaff" v-on="on">edit</v-icon>
            </template>
            <study-info-card
              :existingStudy="study"
              :key="studyDialog"
              @close-study-dialog="closeStudyDialog(true, study)"
            />
          </v-dialog>
        </v-card-title>

        <!-- Body -->
        <v-card-text class="text-xs-left">
          <!-- Study Description -->
          <div v-if="study.description" class="text-left pt-3">{{ study.description }}</div>
          <div v-else class="grey--text text--lighten-0 font-italic">No description available</div>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <!-- Collaborator avatars -->
          <div class="px-1" v-for="collaborator in study.collaborators" :key="collaborator">
            <v-avatar
              v-if="getUserByUrl(collaborator)"
              class="m-1 white--text"
              :color="randomColor()"
            >
              <img
                v-if="getUserByUrl(collaborator).profile['image']"
                :src="getUserByUrl(collaborator).profile['image']"
              />
              <div v-else>{{ getUserInitialsFromUrl(collaborator) | CapitalizeInitials}}</div>
            </v-avatar>
          </div>
        </v-card-actions>
      </v-card>
    </div>
  </v-col>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import StudyInfoCard from '@/components/research/study-info-card.vue'

export default {
  name: 'StudyBrowser',
  components: { StudyInfoCard },
  created() {
    this.fetchUsers({ filters: {}, pagination: {} }).then(() =>
      this.fetchStudies()
    )
  },
  data: () => ({
    editStudyDialog: {},
    colors: [
      'purple',
      'cyan',
      'blue',
      'green',
      'brown',
      'pink',
      'teal',
      'orange'
    ],
    createStudyDialog: false,
    studyDialog: true
  }),
  computed: {
    ...mapState('accounts', ['users']),
    ...mapState('auth', { currentUser: 'user' }),
    ...mapState('research', ['studies']),
    ...mapGetters('accounts', ['getUserByUrl', 'getUserInitialsFromUrl']),
    filteredStudies() {
      return this.currentUser.isStaff
        ? this.studies
        : this.studies.filter(study =>
            study.collaborators.includes(this.currentUser.url)
          )
    }
  },
  methods: {
    closeStudyDialog(updating, study) {
      if (updating) this.editStudyDialog[study.id] = false
      else this.createStudyDialog = false
      this.studyDialog = !this.studyDialog
    },
    randomColor() {
      return randomize(this.colors)
    },
    ...mapActions('accounts', ['fetchUsers']),
    ...mapActions('research', ['fetchStudies'])
  }
}

function randomize(items) {
  return items[Math.floor(Math.random() * items.length)]
}
</script>

<style scoped></style>
