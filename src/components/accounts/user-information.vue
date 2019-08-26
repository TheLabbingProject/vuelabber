<template>
  <v-layout row>
    <v-alert :value="!user" type="error">
      No user found!
    </v-alert>
    <v-layout v-if="user" row>
      <v-flex xs10>
        <v-layout column class="text-xs-left">
          <v-flex pb-4 class="title">
            {{ user | formatResearcherName }}
          </v-flex>
          <v-flex> Institute: {{ user.institute }} </v-flex>
          <v-flex> Email: {{ user.email }} </v-flex>
          <v-flex> Date of Birth: {{ user.dateOfBirth | formatDate }} </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-img :src="user.image" height="240px" width="240px" />
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserInformation',
  created() {
    this.fetchUsers({ filters: { username: this.username }, pagination: {} })
  },
  props: { username: String },
  computed: {
    user: function() {
      return this.getUserByUsername(this.username)
    },
    ...mapGetters('accounts', ['getUserByUsername'])
  },
  methods: {
    ...mapActions('accounts', ['fetchUsers'])
  }
}
</script>

<style lang="scss" scoped></style>
