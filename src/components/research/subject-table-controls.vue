<template>
  <div>
    <v-flex row pl-4>
      <v-text-field label="ID" style="width: 50px;" v-model="filters.id" />
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
    </v-flex>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'

export default {
  name: 'SubjectTableControls',
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
    addIdFilterString: function(filterString) {
      if (this.filters.id) {
        filterString += `id=${this.filters.id}`
      }
      return filterString
    },
    addFirstNameFilterString: function(filterString) {
      if (this.filters.firstName) {
        filterString += `first_name=${
          this.filters.firstName
        }&first_name_lookup=icontains`
        if (
          this.filters.lastName ||
          this.filters.sex ||
          this.filters.gender ||
          this.filters.bornAfter ||
          this.filters.bornBefore ||
          this.filters.dominantHand
        ) {
          filterString += '&'
        }
      }
      return filterString
    },
    addLastNameFilterString: function(filterString) {
      if (this.filters.lastName) {
        filterString += `last_name=${
          this.filters.lastName
        }&last_name_lookup=icontains`
        if (
          this.filters.sex ||
          this.filters.gender ||
          this.filters.bornAfter ||
          this.filters.bornBefore ||
          this.filters.dominantHand
        ) {
          filterString += '&'
        }
      }
      return filterString
    },
    addSexFilterString: function(filterString) {
      if (this.filters.sex) {
        filterString += `sex=${this.sexOptions[this.filters.sex]}`
        if (
          this.filters.gender ||
          this.filters.bornAfter ||
          this.filters.bornBefore ||
          this.filters.dominantHand
        ) {
          filterString += '&'
        }
      }
      return filterString
    },
    addBornAfterFilterString: function(filterString) {
      if (this.filters.bornAfter) {
        filterString += `born_after_date=${this.filters.bornAfter}`
        if (
          this.filters.gender ||
          this.filters.bornBefore ||
          this.filters.dominantHand
        ) {
          filterString += '&'
        }
      }
      return filterString
    },
    addBornBeforeFilterString: function(filterString) {
      if (this.filters.bornBefore) {
        filterString += `born_before_date=${this.filters.bornBefore}`
        if (this.filters.gender || this.filters.dominantHand) {
          filterString += '&'
        }
      }
      return filterString
    },
    addGenderFilterString: function(filterString) {
      if (this.filters.gender) {
        filterString += `gender=${this.genderOptions[this.filters.gender]}`
        if (this.filters.dominantHand) {
          filterString += '&'
        }
      }
      return filterString
    },
    addDominantHandFilterString: function(filterString) {
      if (this.filters.dominantHand) {
        filterString += `dominant_hand=${
          this.dominantHandOptions[this.filters.dominantHand]
        }`
      }
      return filterString
    },
    createFilterString: function() {
      let filterString = ''
      if (this.filters.id) {
        filterString = this.addIdFilterString(filterString)
        return filterString
      }
      filterString = this.addFirstNameFilterString(filterString)
      filterString = this.addLastNameFilterString(filterString)
      filterString = this.addSexFilterString(filterString)
      filterString = this.addBornAfterFilterString(filterString)
      filterString = this.addBornBeforeFilterString(filterString)
      filterString = this.addGenderFilterString(filterString)
      filterString = this.addDominantHandFilterString(filterString)
      return filterString
    },
    ...mapActions('research', ['filterSubjects'])
  },
  watch: {
    filters: {
      handler(newValue) {
        let filterString = this.createFilterString(newValue)
        this.filterSubjects(filterString)
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
