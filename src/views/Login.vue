<template>
  <div id="login-view">
    <form @submit.prevent="submit">
      <v-flex>
        <v-text-field
          v-model="inputs.username"
          type="text"
          id="username"
          label="Username"
          required
        />
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="inputs.password"
          type="password"
          id="password"
          label="Password"
          required
        />
      </v-flex>
      <v-btn @click="login(inputs)" color="success" id="login-button"
        >login</v-btn
      >
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data: () => {
    return {
      inputs: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login({ username, password }) {
      this.$store
        .dispatch('auth/login', { username, password })
        .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style scoped></style>
