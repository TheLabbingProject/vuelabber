<template>
  <v-container fluid>
    <user-information :username="username" />
  </v-container>
</template>

<script>
import UserInformation from '@/components/accounts/user-information.vue'

export default {
  name: 'User',
  props: { username: String },
  components: { UserInformation }
}
</script>

<style lang="scss" scoped></style>
