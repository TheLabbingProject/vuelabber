<template>
  <v-layout column>
    <v-flex row px-3>
      <v-text-field label="ID" v-model="filters.id" />
      <v-spacer />
      <v-text-field
        label="First Name"
        v-model="filters.firstName"
        :disabled="Boolean(filters.id)"
      />
      <v-spacer />
      <v-text-field
        label="Last Name"
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
              v-model="filters.bornAfter"
              label="Born After"
              prepend-icon="event"
              readonly
              clearable
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
              v-model="filters.bornBefore"
              label="Born Before"
              prepend-icon="event"
              readonly
              v-on="on"
              :disabled="Boolean(filters.id)"
              clearable
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.bornBefore"
            @input="bornBeforeMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-flex>
    </v-flex>
    <v-flex row px-3>
      <v-select
        label="Sex"
        v-model="filters.sex"
        clearable
        :disabled="Boolean(filters.id)"
        :items="Object.keys(sexOptions)"
      />
      <v-spacer />
      <v-select
        label="Gender"
        v-model="filters.gender"
        clearable
        :disabled="Boolean(filters.id)"
        :items="Object.keys(genderOptions)"
      />
      <v-spacer />
      <v-select
        label="Dominant Hand"
        v-model="filters.dominantHand"
        clearable
        :disabled="Boolean(filters.id)"
        :items="Object.keys(dominantHandOptions)"
      />
    </v-flex>
    <v-flex>
      <v-data-table
        item-key="id"
        :headers="headers"
        :items="subjects"
        :rows-per-page-items="[
          10,
          25,
          50,
          { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
        ]"
      >
        <template v-slot:items="props">
          <tr
            @click="setSelectedSubjectId(props.item.id)"
            :class="{ selected: props.item.id === selectedSubjectId }"
          >
            <td class="text-xs-left">
              {{ props.item.id }}
            </td>

            <td class="text-xs-left">
              {{ props.item.firstName }}
            </td>
            <td class="text-xs-left">
              {{ props.item.lastName }}
            </td>
            <td class="text-xs-left">
              {{ props.item.dateOfBirth }}
            </td>
            <td class="text-xs-left">
              {{ getSubjectSexDisplay(props.item) }}
            </td>
            <td class="text-xs-left">
              {{ getSubjectGenderDisplay(props.item) }}
            </td>
            <td class="text-xs-left">
              {{ getSubjectDominantHandDisplay(props.item) }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'SubjectTable',
  created() {
    this.fetchSubjects()
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'First Name', value: 'givenName' },
      { text: 'Last Name', value: 'familyName' },
      { text: 'Date of Birth', value: 'dateOfBirth' },
      { text: 'Sex', value: 'sex' },
      { text: 'Gender', value: 'gender' },
      { text: 'Dominant Hand', value: 'dominantHand' }
    ],
    bornAfterMenu: false,
    bornBeforeMenu: false,
    sexOptions: { Male: 'M', Female: 'F', Other: 'O' },
    genderOptions: { Cisgender: 'CIS', Transgender: 'TRANS', Other: 'OTHER' },
    dominantHandOptions: { Right: 'R', Left: 'L', Ambidextrous: 'A' },
    filters: {
      id: '',
      firstName: '',
      lastName: '',
      bornAfter: '',
      bornBefore: '',
      sex: '',
      gender: '',
      dominantHand: ''
    }
  }),
  computed: {
    ...mapState('research', ['subjects', 'selectedSubjectId'])
  },
  methods: {
    getSubjectSexDisplay: function(subject) {
      return getKeyByValue(this.sexOptions, subject.sex)
    },
    getSubjectGenderDisplay: function(subject) {
      return getKeyByValue(this.genderOptions, subject.gender)
    },
    getSubjectDominantHandDisplay: function(subject) {
      return getKeyByValue(this.dominantHandOptions, subject.dominantHand)
    },
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
    ...mapActions('research', ['fetchSubjects', 'filterSubjects']),
    ...mapMutations('research', ['setSelectedSubjectId'])
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

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}
</script>

<style lang="scss" scoped>
tr.selected {
  background-color: #b3d4fc77;
}
</style>
