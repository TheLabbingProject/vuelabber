<template>
  <div>
    <v-container>
      <v-col>
        <!-- Labs Summary Information -->
        <!-- Title -->
        <div class="title pb-3">
          Labs
        </div>

        <!-- Cards -->
        <v-row class="text-left">
          <v-col cols="3" v-for="lab in labs" :key="`lab-card-${lab.id}`">
            <v-card color="grey lighten-3">
              <v-img v-if="lab.image" :src="lab.image" aspect-ratio="2.5" />
              <v-img v-else src="/Laboratory.jpg" aspect-ratio="2.5" />
              <v-card-title>{{ lab.title }}</v-card-title>
              <v-card-text>{{ lab.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-divider />

      <!-- Researchers Summary Information -->
      <!-- Title -->
      <v-col>
        <div class="title pt-2 pb-6">
          Researchers
        </div>

        <!-- Cards -->
        <v-row>
          <v-col cols="3" v-for="user in users" :key="`user-card-${user.pk}`">
            <v-card
              hover
              color="grey lighten-2 pa-1"
              :to="`user/${user.username}`"
            >
              <v-row>
                <v-col cols="4">
                  <v-avatar size="100px">
                    <v-img
                      v-if="user.profile && user.profile['image']"
                      :src="user.profile['image']"
                    />
                    <v-img v-else src="/user.png" />
                  </v-avatar>
                </v-col>
                <v-col>
                  <v-card-title class="text-left pl-0">
                    <v-col>
                      <div class="subtitle-2">
                        {{ user | formatResearcherName }}
                        <span class="subtitle-3 grey--text font-italic">
                          (@{{ user.username }})
                        </span>
                      </div>
                      <div
                        v-for="labId in user.laboratorySet"
                        class="subtitle-2 grey--text font-italic"
                        :key="`user-${user.id}-lab-${labId}`"
                      >
                        {{ getLabTitle(labId) }}
                      </div>
                      <div class="subtitle-2 grey--text">
                        {{ user.profile.institute }}
                      </div>
                    </v-col>
                  </v-card-title>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'HomeView',
  mounted() {
    this.fetchLabs().then(() => this.fetchUsers(this.emptyQuery))
  },
  data: () => ({
    emptyQuery: { filters: {}, options: {} }
  }),
  computed: {
    ...mapState('accounts', ['labs', 'users']),
    ...mapState('auth', ['user'])
  },
  methods: {
    getLabTitle: function(labId) {
      try {
        let lab = this.labs.find(laboratory => laboratory.id === labId)
        return lab ? lab.title : ''
      } catch (e) {
        return ''
      }
    },
    ...mapActions('accounts', ['fetchLabs', 'fetchUsers'])
  }
}
</script>
