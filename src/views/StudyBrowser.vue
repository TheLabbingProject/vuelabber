<template>
  <v-layout column>
    <v-card class="mb-4 mx-3" v-for="study in studies" :key="study.id">
      <v-card-title class="title purple darken-2 white--text">
        {{ study.title }}
      </v-card-title>
      <v-card-text class="text-xs-left">
        <div v-if="study.description">
          {{ study.description }}
        </div>
        <div v-else class="grey--text text--lighten-0 font-italic">
          No description available
        </div>
      </v-card-text>
      <v-card-actions>
        <div v-for="collaborator in study.collaborators" :key="collaborator">
          <v-avatar
            v-if="getUserByUrl(collaborator)"
            class="m-1 white--text"
            :color="randomColor()"
          >
            <img
              v-if="getUserByUrl(collaborator).image"
              :src="getUserByUrl(collaborator).image"
            />
            <div v-else>
              {{ getUserInitialsFromUrl(collaborator) }}
            </div>
          </v-avatar>
        </div>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'StudyBrowser',
  created() {
    this.fetchUsers().then(this.fetchStudies())
  },
  data: () => ({
    colors: [
      'purple',
      'cyan',
      'blue',
      'green',
      'brown',
      'pink',
      'teal',
      'orange'
    ]
  }),
  computed: {
    ...mapGetters('accounts', ['getUserByUrl', 'getUserInitialsFromUrl']),
    ...mapState('accounts', ['users']),
    ...mapState('research', ['studies'])
  },
  methods: {
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

<style lang="scss" scoped></style>
