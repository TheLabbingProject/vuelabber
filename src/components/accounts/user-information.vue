<template>
  <div>
    <v-alert :value="!user" type="error">
      No user found!
    </v-alert>
    <div v-if="user">
      <div>
        {{ user.firstName }}
      </div>
      <div>
        {{ user.lastName }}
      </div>
    </div>
  </div>
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
