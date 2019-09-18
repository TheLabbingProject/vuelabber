<template>
  <v-card>
    <!-- Title -->
    <v-card-title class="green darken-3">
      <div class="headline">
        <span class="white--text">
          Subject Information
        </span>
        <span v-if="existingSubject" class="grey--text text--lighten-1">
          {{ `#${subject.id}` }}
        </span>
      </div>
      <v-spacer />

      <!-- Delete Button -->
      <v-icon
        v-if="editable && currentUserIsStaff"
        style="cursor: pointer;"
        @dblclick="deleteSubject(existingSubject)"
      >
        delete
      </v-icon>
    </v-card-title>

    <!-- Body -->
    <v-card-text>
      <v-layout column>
        <v-form @submit.prevent="submit">
          <!-- First Name -->
          <v-text-field
            label="First Name"
            v-model="subject.firstName"
            :counter="64"
            :disabled="!(editable || subject.firstName)"
            :readonly="!editable"
          />

          <!-- Last Name -->
          <v-text-field
            label="Last Name"
            v-model="subject.lastName"
            :counter="64"
            :disabled="!(editable || subject.lastName)"
            :readonly="!editable"
          />

          <!-- Dominant Hand -->
          <v-select
            label="Dominant Hand"
            v-model="subjectDominantHand"
            :items="Object.keys(dominantHandOptions)"
            :readonly="!editable"
            :disabled="!(editable || subjectDominantHand)"
          />

          <!-- Sex -->
          <v-select
            label="Sex"
            v-model="subjectSex"
            :disabled="!(editable || subjectSex)"
            :items="Object.keys(sexOptions)"
            :readonly="!editable"
          />

          <!-- Gender -->
          <v-select
            label="Gender"
            v-model="subjectGender"
            :disabled="!(editable || subjectGender)"
            :items="Object.keys(genderOptions)"
            :readonly="!editable"
          />

          <!-- Date of Birth -->
          <v-menu
            v-model="dob_menu"
            lazy
            min-width="290px"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Date of Birth"
                prepend-icon="cake"
                v-model="formattedDate"
                v-on="on"
                :disabled="!(editable || formattedDate)"
                :readonly="!editable"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="subject.dateOfBirth"
              @input="dob_menu = false"
            ></v-date-picker>
          </v-menu>
        </v-form>
      </v-layout>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions>
      <!-- View/Edit mode switch -->
      <v-flex v-if="currentUserIsStaff" px-3>
        <v-switch
          v-if="existingSubject"
          v-model="editable"
          :label="editable ? 'Edit Mode' : 'View Mode'"
        />
      </v-flex>
      <v-spacer />
      <!-- Update -->
      <v-btn
        color="warning"
        flat
        v-if="editable && existingSubject"
        :disabled="!currentUserIsStaff"
        @click="updateExistingSubject()"
      >
        Update
      </v-btn>

      <!-- Create -->
      <v-btn
        color="success"
        flat
        v-if="!existingSubject && currentUserIsStaff"
        @click="createNewSubject"
      >
        Create
      </v-btn>

      <!-- Cancel -->
      <v-btn color="error" flat @click="closeDialog">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { getKeyByValue } from './utils.js'

export default {
  name: 'SubjectInfoCard',
  props: {
    existingSubject: Object,
    createMode: { type: Boolean, default: false }
  },
  created() {
    if (this.existingSubject) {
      this.subject = Object.assign({}, this.existingSubject)
      this.editable = false
    }
  },
  data: () => ({
    selectedSubjectRepresentation: '',
    subject: Object.assign({}, cleanSubject),
    editable: true,
    dob_menu: false,
    radioGroup: 'new',
    sexOptions,
    genderOptions,
    dominantHandOptions
  }),
  computed: {
    subjectSex: {
      get: function() {
        return getKeyByValue(this.sexOptions, this.subject.sex)
      },
      set: function(newValue) {
        this.subject.sex = this.sexOptions[newValue]
      }
    },
    subjectGender: {
      get: function() {
        return getKeyByValue(this.genderOptions, this.subject.gender)
      },
      set: function(newValue) {
        this.subject.gender = this.genderOptions[newValue]
      }
    },
    subjectDominantHand: {
      get: function() {
        return getKeyByValue(
          this.dominantHandOptions,
          this.subject.dominantHand
        )
      },
      set: function(newValue) {
        this.subject.dominantHand = this.dominantHandOptions[newValue]
      }
    },
    formattedDate: function() {
      return formatDate(this.subject.dateOfBirth)
    },
    ...mapState('research', ['subjects']),
    ...mapGetters('accounts', ['currentUserIsStaff'])
  },
  methods: {
    closeDialog() {
      if (this.existingSubject && this.editable) this.editable = false
      this.$emit('close-subject-dialog')
    },
    updateExistingSubject() {
      this.updateSubject(this.subject)
        .then(data => (this.subject = Object.assign({}, data)))
        .then(this.closeDialog())
    },
    createNewSubject() {
      this.createSubject(this.subject)
        .then(() => (this.editable = false))
        .then(this.closeDialog())
    },
    getSubjectRepresentation(subject) {
      let rep = `Subject #${subject.id}`
      if (subject.firstName && subject.lastName) {
        rep = rep.concat(` [${subject.firstName} ${subject.lastName}]`)
      }
      return rep
    },
    ...mapActions('research', [
      'createSubject',
      'updateSubject',
      'deleteSubject'
    ])
  },
  watch: {
    editable: function(isEditable) {
      if (!isEditable) {
        this.subject = Object.assign({}, this.existingSubject)
      }
    }
  }
}

const cleanSubject = {
  idNumber: '',
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  dominantHand: null,
  sex: null,
  gender: null
}

function formatDate(date) {
  if (!date) return null
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
</script>

<style lang="scss" scoped>
>>> label {
  margin-bottom: 0rem;
}
</style>
