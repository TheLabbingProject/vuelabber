<template>
  <v-layout row>
    <!-- For an invalid username, display error alert -->
    <v-alert :value="!user" type="error">
      No user found!
    </v-alert>

    <!-- For a valid user, display user information -->
    <v-layout v-if="user && !editMode" row>
      <v-flex xs10>
        <v-layout column class="text-xs-left">
          <v-flex pb-4 class="title">
            <span>
              {{ user | formatResearcherName }}
            </span>
            <!-- If current user is the viewed user, or staff, display edit icon -->
            <v-icon
              class="pl-2"
              v-if="editPermissions"
              @click="editMode = true"
            >
              edit
            </v-icon>
          </v-flex>
          <v-flex pb-2> Institute: {{ user.institute }} </v-flex>
          <v-flex pb-2> Email: {{ user.email }} </v-flex>
          <v-flex pb-2>
            Date of Birth: {{ user.dateOfBirth | formatDate }}
          </v-flex>
          <v-flex pb-2> Bio: {{ user.bio }} </v-flex>
        </v-layout>
      </v-flex>

      <!-- Image -->
      <v-flex xs2>
        <v-img :src="user.image" height="240px" width="240px" />
      </v-flex>
    </v-layout>
    <edit-user-information
      v-if="user && editMode"
      :userInformation="user"
      @finished-edit="editMode = false"
    />
  </v-layout>
</template>

<script>
// import UserInformationCard from '@/components/accounts/user-information-card.vue'
import EditUserInformation from '@/components/accounts/edit-user-information.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserInformation',
  created() {
    this.fetchUsers({ filters: { username: this.username }, pagination: {} })
  },
  components: { EditUserInformation },
  props: { username: String },
  data: () => ({
    editMode: false,
    editUserDialog: false
  }),
  computed: {
    user: function() {
      return this.users[0]
    },
    editPermissions: function() {
      if (this.user && this.currentUser) {
        let isCurrentUser = this.currentUser.id === this.user.id
        return isCurrentUser || this.currentUser.isStaff
      }
      return false
    },
    ...mapState('accounts', ['users']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    ...mapActions('accounts', ['fetchUsers'])
  }
}
</script>

<style lang="scss" scoped></style>
