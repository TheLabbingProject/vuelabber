<template>
  <v-container>
    <v-col>
      <v-row class="text-left">
        <!-- For an invalid username, display error alert -->
        <v-alert :value="!user" type="error">No user found!</v-alert>

        <!-- For a valid user, display user information -->
        <v-row v-if="user && !editMode">
          <v-col cols="10">
            <div class="title pb-2">
              <span>{{ user | formatResearcherName }}</span>
              <!-- If current user is the viewed user, or staff, display edit icon -->
              <v-icon
                class="pl-2"
                v-if="editPermissions"
                @click="editMode = true"
                >edit</v-icon
              >
            </div>
            <div>Institute: {{ user.profile.institute }}</div>
            <div>Email: {{ user.email }}</div>
            <div>
              Date of Birth: {{ user.profile.dateOfBirth | formatDate }}
            </div>
            <div>Bio: {{ user.profile.bio }}</div>
          </v-col>

          <!-- Image -->
          <v-col cols="2">
            <v-img
              v-if="user.profile.image"
              :src="user.profile.image"
              height="240px"
              width="240px"
            />
            <v-img v-else src="/user.png" height="240px" width="240px" />
          </v-col>
        </v-row>

        <!-- Edit user information -->
        <edit-user-information
          v-if="user && editMode"
          :userInformation="user"
          @finished-edit="editMode = false"
        />
      </v-row>
      <v-row>
        <export-destination-table
          v-if="editPermissions && !editMode"
          :user="user"
        />
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
// import UserInformationCard from '@/components/accounts/user-information-card.vue'
import EditUserInformation from '@/components/accounts/edit-user-information.vue'
import ExportDestinationTable from '@/components/accounts/export-destination-table.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserInformation',
  mounted() {
    let query = { filters: { username: this.username }, options: {} }
    this.fetchUsers(query)
  },
  components: {
    EditUserInformation,
    ExportDestinationTable
  },
  props: { username: String },
  data: () => ({
    editMode: false,
    editUserDialog: false
  }),
  computed: {
    user: function() {
      return this.users
        ? this.users.find(user => user.username == this.username)
        : null
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
