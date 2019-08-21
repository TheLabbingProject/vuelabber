<template>
  <v-layout column>
    <!-- Create new study button -->
    <v-layout mx-0 row v-if="currentUserIsStaff">
      <v-spacer />
      <v-dialog v-model="createStudyDialog" width="400px" lazy>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="info">
            New Study
          </v-btn>
        </template>
        <study-info-card @close-study-dialog="createStudyDialog = false" />
      </v-dialog>
    </v-layout>

    <!-- Existing study card -->
    <v-card class="mb-4 mx-2" v-for="study in studies" :key="study.id">
      <!-- Title -->
      <v-card-title class="title purple darken-2 white--text">
        <span>
          {{ study.title }}
        </span>
        <v-spacer />
        <!-- Edit study dialog button -->
        <v-dialog v-model="editStudyDialog[study.id]" width="400px" lazy>
          <template v-slot:activator="{ on }">
            <v-icon v-if="currentUserIsStaff" v-on="on">
              edit
            </v-icon>
          </template>
          <study-info-card
            :key="editStudyDialog[study.id]"
            :existingStudy="study"
            @close-study-dialog="editStudyDialog[study.id] = false"
          />
        </v-dialog>
      </v-card-title>

      <!-- Body -->
      <v-card-text class="text-xs-left">
        <!-- Study Description -->
        <div v-if="study.description">
          {{ study.description }}
        </div>
        <div v-else class="grey--text text--lighten-0 font-italic">
          No description available
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions>
        <!-- Collaborator avatars -->
        <div
          class="px-1"
          v-for="collaborator in study.collaborators"
          :key="collaborator"
        >
          <v-avatar
            v-if="getProfileByUserUrl(collaborator)"
            class="m-1 white--text"
            :color="randomColor()"
          >
            <img
              v-if="getProfileByUserUrl(collaborator).image"
              :src="getProfileByUserUrl(collaborator).image"
            />
            <div v-else>
              {{ getUserInitialsFromProfileUrl(collaborator) }}
            </div>
          </v-avatar>
        </div>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import StudyInfoCard from '@/components/research/study-info-card.vue'

export default {
  name: 'StudyBrowser',
  components: { StudyInfoCard },
  created() {
    this.fetchProfiles().then(() => this.fetchStudies())
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
    createStudyDialog: false
  }),
  computed: {
    ...mapGetters('accounts', [
      'getProfileByUserUrl',
      'getUserInitialsFromProfileUrl',
      'currentUserIsStaff'
    ]),
    ...mapState('accounts', ['users']),
    ...mapState('research', ['studies'])
  },
  methods: {
    randomColor() {
      return randomize(this.colors)
    },
    ...mapActions('accounts', ['fetchProfiles']),
    ...mapActions('research', ['fetchStudies'])
  }
}

function randomize(items) {
  return items[Math.floor(Math.random() * items.length)]
}
</script>

<style scoped></style>
