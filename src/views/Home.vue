<template>
  <div>
    <!-- Labs Summary Information -->
    <!-- Title -->
    <div class="title">Labs</div>

    <!-- Cards -->
    <v-row class="text-left">
      <v-col cols="3" v-for="lab in labs" :key="lab.id">
        <v-card color="grey lighten-3">
          <v-img v-if="lab.image" :src="lab.image" aspect-ratio="2.5" />
          <v-img v-else src="/Laboratory.jpg" aspect-ratio="2.5" />
          <v-card-title>{{ lab.title }}</v-card-title>
          <v-card-text>{{ lab.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-divider />

    <!-- Researchers Summary Information -->
    <!-- Title -->
    <div class="title">Researchers</div>

    <!-- Cards -->
    <v-row>
      <v-col cols="3" v-for="user in users" :key="user.id">
        <v-card hover color="grey lighten-2" :to="`user/${user.username}`">
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
                  <div class="subtitle-1">
                    {{ user | formatResearcherName }}
                  </div>
                  <div class="subtitle-2 grey--text font-italic">
                    {{ user.profile.institute }}
                  </div>
                </v-col>
              </v-card-title>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'HomeView',
  mounted() {
    this.fetchLabs()
    let query = { filters: {}, options: {} }
    this.fetchUsers(query)
  },
  computed: {
    ...mapState('accounts', ['labs', 'users'])
  },
  methods: {
    ...mapActions('accounts', ['fetchLabs', 'fetchUsers'])
  }
}
</script>
