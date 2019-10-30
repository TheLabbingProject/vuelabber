<template>
  <v-row class="px-5 align-center justify-space-between">
    <!-- ID -->
    <v-col cols="1">
      <v-text-field label="ID" v-model="filters.id" />
    </v-col>

    <!-- Patient UID -->
    <v-col cols="1">
      <v-text-field
        label="Patient UID"
        v-model="filters.uid"
        :disabled="Boolean(filters.id)"
      />
    </v-col>

    <!-- First Name -->
    <v-col cols="1">
      <v-text-field
        label="First Name"
        v-model="filters.firstName"
        :disabled="Boolean(filters.id)"
      />
    </v-col>

    <!-- Last Name -->
    <v-col cols="1">
      <v-text-field
        label="Last Name"
        v-model="filters.lastName"
        :disabled="Boolean(filters.id)"
      />
    </v-col>

    <!-- Sex -->
    <v-col cols="1">
      <v-select
        clearable
        label="Sex"
        v-model="filters.sex"
        :disabled="Boolean(filters.id)"
        :items="Object.keys(sexOptions)"
      />
    </v-col>

    <v-col cols="3">
      <v-row class="align-center">
        <v-col>
          <v-menu v-model="bornAfterMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field
                clearable
                readonly
                label="Born After"
                prepend-icon="event"
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
        </v-col>
        -
        <v-col>
          <v-menu v-model="bornBeforeMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field
                clearable
                readonly
                label="Born Before"
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
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import { sexOptions } from './utils'

export default {
  name: 'PatientTableControls',
  props: { options: Object, studyId: Number },
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
      this.fetchPatients({ filters: this.filters, options: this.options })
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
    options: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
