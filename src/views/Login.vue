<template>
  <div id="login-view">
    <v-alert :value="error" type="error">
      Invalid username or password!
    </v-alert>
    <form @submit.prevent="submit">
      <v-text-field
        v-model="inputs.username"
        type="text"
        id="username"
        label="Username"
        required
      />
      <v-text-field
        v-model="inputs.password"
        type="password"
        id="password"
        label="Password"
        required
      />
      <v-btn @click="loginHandler(inputs)" color="success" id="login-button">
        Login
      </v-btn>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'LoginView',
  data: () => ({
    inputs: {
      username: '',
      password: ''
    }
  }),
  computed: {
    ...mapState('auth', ['error'])
  },
  methods: {
    loginHandler({ username, password }) {
      this.login({ username, password }).then(() => {
        if (!this.error) {
          this.$router.push('/')
        }
      })
    },
    ...mapActions('auth', ['login'])
  }
}
</script>

<style scoped></style>
