<template>
  <div id="login-view">
    <form @submit.prevent="submit">
      <v-text-field
        v-model="inputs.username"
        type="text"
        id="username"
        placeholder="Username"
        required
      />
      <v-text-field
        v-model="inputs.password"
        type="password"
        id="password"
        placeholder="Password"
        required
      />
    </form>
    <v-btn @click="login(inputs)" color="success" id="login-button"
      >login</v-btn
    >
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

<style scoped>
>>> .login-title {
  text-align: left;
}
</style>
