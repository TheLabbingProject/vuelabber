<template>
  <v-layout column>
    <!-- Labs Summary Information -->
    <v-flex pb-2>
      <!-- Title -->
      <h2>
        Labs
      </h2>
      <!-- Cards -->
      <v-layout pt-2 row wrap>
        <v-card
          class="ma-3"
          color="grey lighten-3"
          v-for="lab in labs"
          width="300px"
          :key="lab.id"
        >
          <v-img
            v-if="lab.image"
            :src="lab.image"
            aspect-ratio="2.5"
            width="300px"
          />
          <v-img
            v-else
            src="/Laboratory.jpg"
            aspect-ratio="2.5"
            width="300px"
          />
          <v-card-title primary-title>
            <h3 class="headline mb-0">{{ lab.title }}</h3>
          </v-card-title>
          <v-card-text class="text-xs-left">
            <div>{{ lab.description }}</div>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-flex>

    <v-divider />

    <!-- Researchers Summary Information -->
    <v-flex py-2>
      <!-- Title -->
      <h2>
        Researchers
      </h2>
      <!-- Cards -->
      <v-layout pt-2 row wrap>
        <v-card
          hover
          class="ma-2"
          color="grey lighten-2"
          v-for="user in users"
          :key="user.id"
          :to="`user/${user.username}`"
        >
          <v-layout row>
            <v-flex ma-2 xs-5>
              <v-avatar size="100px">
                <v-img v-if="user.image" :src="user.image" />
                <v-img v-else src="/user.png" />
              </v-avatar>
            </v-flex>
            <v-flex xs-7>
              <v-card-title primary-title>
                <div class="text-xs-left">
                  <div class="title">
                    {{ user | formatResearcherName }}
                  </div>
                  <div class="grey--text font-italic">
                    {{ user.institute }}
                  </div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'HomeView',
  created() {
    this.fetchLabs()
    this.fetchUsers({ filters: {}, pagination: {} })
  },
  computed: {
    ...mapState('accounts', ['labs', 'users'])
  },
  methods: {
    ...mapActions('accounts', ['fetchLabs', 'fetchUsers'])
  }
}
</script>
