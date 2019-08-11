<template>
  <v-layout row px-3>
    <v-text-field label="ID" v-model="filters.id" style="width: 2px;" />
    <v-spacer />
    <v-text-field
      label="Patient UID"
      style="width: 120px;"
      v-model="filters.uid"
      :disabled="Boolean(filters.id)"
    />
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
    <v-select
      clearable
      label="Sex"
      style="width: 120px;"
      v-model="filters.sex"
      :disabled="Boolean(filters.id)"
      :items="Object.keys(sexOptions)"
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
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { sexOptions } from './utils'

export default {
  name: 'PatientTableControls',
  props: { pagination: Object, studyId: Number },
  created() {
    if (this.studyId) this.filters.studyId = this.studyId
    this.update()
  },
  data: () => ({
    filters: {
      id: null,
      uid: null,
      firstName: null,
      lastName: null,
      sex: null,
      bornAfter: null,
      bornBefore: null,
      studyId: null
    },
    bornAfterMenu: false,
    bornBeforeMenu: false,
    sexOptions
  }),
  methods: {
    update() {
      this.$emit('fetch-patients-start')
      this.fetchPatients({ filters: this.filters, pagination: this.pagination })
      this.$emit('fetch-patients-end')
    },
    ...mapActions('dicom', ['fetchPatients'])
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
