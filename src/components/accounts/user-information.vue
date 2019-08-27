<template>
  <v-layout row>
    <!-- For an invalid username, display error alert -->
    <v-alert :value="!user" type="error">
      No user found!
    </v-alert>

    <!-- For a valid user, display user information -->
    <v-layout v-if="user" row>
      <!-- Information -->
      <v-flex xs10>
        <v-layout column class="text-xs-left">
          <v-flex pb-4 class="title">
            <span>
              {{ user | formatResearcherName }}
            </span>
            <v-dialog v-model="editUserDialog" width="400px">
              <template v-slot:activator="{ on }">
                <v-icon class="pl-2" v-if="editPermissions" v-on="on">
                  edit
                </v-icon>
              </template>
              <user-information-card />
            </v-dialog>
          </v-flex>
          <v-flex> Institute: {{ user.institute }} </v-flex>
          <v-flex> Email: {{ user.email }} </v-flex>
          <v-flex> Date of Birth: {{ user.dateOfBirth | formatDate }} </v-flex>
        </v-layout>
      </v-flex>

      <!-- Image -->
      <v-flex xs2>
        <v-img :src="user.image" height="240px" width="240px" />
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import UserInformationCard from '@/components/accounts/user-information-card.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserInformation',
  components: { UserInformationCard },
  props: { username: String },
  data: () => ({
    editUserDialog: false
  }),
  computed: {
    user: function() {
      return this.getUserByUsername(this.username)
    },
    editPermissions: function() {
      if (this.user && this.currentUser) {
        return this.currentUser.id === this.user.id || this.currentUserIsStaff
      }
      return false
    },
    ...mapGetters('accounts', [
      'currentUser',
      'currentUserIsStaff',
      'getUserByUsername'
    ])
  },
  methods: {
    ...mapActions('accounts', ['fetchUsers'])
  }
}
</script>

<style lang="scss" scoped></style>
