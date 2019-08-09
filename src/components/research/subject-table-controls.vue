<template>
  <v-layout row pl-4>
    <v-text-field label="ID" style="width: 5px;" v-model="filters.id" />
    <v-spacer />
    <v-text-field
      label="First Name"
      style="width: 120px;"
      v-model="filters.firstName"
      :disabled="Boolean(filters.id)"
    />
    <v-spacer />
    <v-text-field
      label="Last Name"
      style="width: 120px;"
      v-model="filters.lastName"
      :disabled="Boolean(filters.id)"
    />
    <v-spacer />
    <v-flex>
      <v-menu
        v-model="bornAfterMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            clearable
            readonly
            label="Born After"
            prepend-icon="event"
            style="width: 160px;"
            v-model="filters.bornAfter"
            v-on="on"
            :disabled="Boolean(filters.id)"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="filters.bornAfter"
          @input="bornAfterMenu = false"
        ></v-date-picker>
      </v-menu>
    </v-flex>
    <v-spacer />
    <v-flex>
      <v-menu
        v-model="bornBeforeMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            clearable
            readonly
            label="Born Before"
            prepend-icon="event"
            style="width: 160px;"
            v-model="filters.bornBefore"
            v-on="on"
            :disabled="Boolean(filters.id)"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="filters.bornBefore"
          @input="bornBeforeMenu = false"
        ></v-date-picker>
      </v-menu>
    </v-flex>
    <v-select
      clearable
      label="Sex"
      style="width: 70px;"
      v-model="filters.sex"
      :disabled="Boolean(filters.id)"
      :items="Object.keys(sexOptions)"
    />
    <v-spacer />
    <v-select
      clearable
      label="Gender"
      style="width: 120px;"
      v-model="filters.gender"
      :disabled="Boolean(filters.id)"
      :items="Object.keys(genderOptions)"
    />
    <v-spacer />
    <v-select
      clearable
      label="Dominant Hand"
      style="width: 120px;"
      v-model="filters.dominantHand"
      :disabled="Boolean(filters.id)"
      :items="Object.keys(dominantHandOptions)"
    />
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'

export default {
  name: 'SubjectTableControls',
  props: { pagination: Object },
  created() {
    this.fetchSubjects({ filters: this.filters, pagination: this.pagination })
  },
  data: () => ({
    bornAfterMenu: false,
    bornBeforeMenu: false,
    filters: {
      id: '',
      firstName: '',
      lastName: '',
      bornAfter: '',
      bornBefore: '',
      sex: '',
      gender: '',
      dominantHand: ''
    },
    sexOptions,
    genderOptions,
    dominantHandOptions
  }),
  methods: {
    update() {
      this.$emit('fetch-subjects-start')
      this.fetchSubjects({ filters: this.filters, pagination: this.pagination })
      this.$emit('fetch-subjects-end')
    },
    ...mapActions('research', ['fetchSubjects'])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    pagination: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
