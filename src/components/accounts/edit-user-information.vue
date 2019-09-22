<template>
  <v-layout column>
    <v-form @submit.prevent="submit">
      <v-text-field label="Username" v-model="user.username" disabled />
      <v-select
        label="Title"
        v-model="title"
        :items="Object.values(titlesDictionary)"
      />
      <v-text-field label="First Name" v-model="user.firstName" />
      <v-text-field label="Last Name" v-model="user.lastName" />
      <v-text-field label="Email" v-model="user.email" />
      <v-menu
        v-model="dateOfBirthMenu"
        lazy
        min-width="290px"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            label="Date of Birth"
            prepend-icon="cake"
            v-model="user.dateOfBirth"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="user.dateOfBirth"
          @input="dateOfBirthMenu = false"
        ></v-date-picker>
      </v-menu>
    </v-form>
    <v-btn @click="cancel">
      Cancel
    </v-btn>
  </v-layout>
</template>

<script>
import { getKeyByValue, titlesDictionary } from '@/utils'

export default {
  name: 'EditUserInformation',
  props: { userInformation: Object },
  created() {
    this.user = Object.assign({}, this.userInformation)
  },
  data: () => ({
    titlesDictionary,
    dateOfBirthMenu: false
  }),
  computed: {
    title: {
      get: function() {
        return this.titlesDictionary[this.user.title]
      },
      set: function(selectedTitle) {
        this.user.title = getKeyByValue(this.titlesDictionary, selectedTitle)
      }
    }
  },
  methods: {
    cancel: function() {
      this.user = Object.assign({}, this.userInformation)
      this.$emit('finished-edit')
    }
  }
}
</script>

<style lang="scss" scoped></style>
