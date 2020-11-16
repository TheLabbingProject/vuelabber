<template>
  <div>
    <v-data-table
      dense
      item-key="id"
      :headers="headers"
      :items="users"
      :loading="loading"
      :options.sync="options"
      :server-items-length="userCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <user-table-controls
          :options="options"
          :study="study"
          @fetch-users-start="loading = true"
          @fetch-users-end="loading = false"
        />
      </template>

      <!-- First Name -->
      <template v-slot:item.firstName="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.firstName"
          large
          @save="saveFirstName(item)"
        >
          <div>{{ item.firstName }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.firstName"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Last Name -->
      <template v-slot:item.lastName="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.lastName"
          large
          @save="saveLastName(item)"
        >
          <div>{{ item.lastName }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.lastName"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Email -->
      <template v-slot:item.email="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.email"
          large
          @save="saveEmail(item)"
        >
          <div>{{ item.email }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.email"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Institute -->
      <template v-slot:item.profile.institute="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.profile.institute"
          large
          @save="saveInstitute(item)"
        >
          <div>{{ item.profile.institute }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.profile.institute"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import UserTableControls from '@/components/accounts/user-table-controls.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserTable',
  components: {
    UserTableControls
  },
  props: ['study'],
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left', width: 1 },
      { text: 'First Name', value: 'firstName' },
      { text: 'Last Name', value: 'lastName' },
      { text: 'Email', value: 'email' },
      { text: 'Institute', value: 'profile.institute' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['lastName'],
      sortDesc: [false]
    },
    itemsPerPageOptions: [10, 20, 30],
    loading: false,
    expanded: [],
    expand: true,
    userDialog: false,
    chosenIndex: -1
  }),
  computed: {
    ...mapState('accounts', ['users', 'userCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    saveFirstName(user) {
      let data = { userId: user.id, firstName: user.firstName }
      this.patchUser(data)
    },
    saveLastName(user) {
      let data = { userId: user.id, lastName: user.lastName }
      this.patchUser(data)
    },
    saveEmail(user) {
      let data = { userId: user.id, email: user.email }
      this.patchUser(data)
    },
    saveInstitute(user) {
      let data = {
        userId: user.id,
        profile: { institute: user.profile.institute }
      }
      this.patchUser(data)
    },
    ...mapActions('accounts', ['patchUser'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.user-info {
  background-color: #dfe9fd;
}
</style>