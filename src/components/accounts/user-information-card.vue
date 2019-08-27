<template>
  <v-card>
    <v-card-title>
      Edit User Information
    </v-card-title>
    <v-card-text>
      <v-layout wrap column>
        <v-form @submit.prevent="submit">
          <!-- Username -->
          <v-text-field label="Username" v-model="user.username" />
        </v-form>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn color="success">
        Update
      </v-btn>
      <v-btn color="error">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'UserInformationCard',
  data: () => ({
    user: {
      id: null,
      username: null,
      email: null,
      title: null,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      institute: null,
      bio: null,
      image: null,
      isStaff: null
    }
  })
}
</script>

<style lang="scss" scoped></style>
