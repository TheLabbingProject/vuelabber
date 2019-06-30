<template>
  <v-card>
    <v-card-title class="green darken-3">
      <div class="headline">
        <span class="white--text">
          Subject Information
        </span>
        <span v-if="existingSubject" class="grey--text text--lighten-1">
          {{ `#${subject.id}` }}
        </span>
      </div>
    </v-card-title>
    <v-card-text>
      <v-layout wrap column>
        <v-radio-group
          row
          v-model="radioGroup"
          v-if="!(existingSubject || createMode)"
        >
          <v-radio label="New Subject" value="new" />
          <v-radio label="Existing subject" value="existing" />
        </v-radio-group>
        <v-layout row pl-3 v-if="radioGroup == 'existing'">
          <v-flex>
            <v-select
              v-model="selectedSubjectRepresentation"
              :items="
                subjects.map(subject => getSubjectRepresentation(subject))
              "
            />
          </v-flex>
        </v-layout>
        <v-form v-if="radioGroup == 'new'" @submit.prevent="submit">
          <v-flex row mx-0>
            <v-flex pr-5>
              <v-text-field
                v-model="subject.firstName"
                label="First Name"
                :counter="64"
                :disabled="!(editable || subject.firstName)"
                :readonly="!editable"
              />
            </v-flex>
            <v-flex>
              <v-text-field
                v-model="subject.lastName"
                label="Last Name"
                :counter="64"
                :disabled="!(editable || subject.lastName)"
                :readonly="!editable"
              />
            </v-flex>
          </v-flex>
          <v-flex row mx-0>
            <v-flex>
              <v-text-field
                v-model="subject.idNumber"
                label="ID Number"
                :counter="64"
                :disabled="!(editable || subject.idNumber)"
                :readonly="!editable"
              />
            </v-flex>
            <v-flex pl-4>
              <v-menu
                v-model="dob_menu"
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
                    v-model="formattedDate"
                    label="Date of Birth"
                    prepend-icon="cake"
                    :disabled="!(editable || formattedDate)"
                    :readonly="!editable"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="subject.dateOfBirth"
                  @input="dob_menu = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex row mx-0>
              <v-flex>
                <v-select
                  v-model="subjectSex"
                  label="Sex"
                  :items="Object.values(sexOptions)"
                  :readonly="!editable"
                  :disabled="!(editable || subjectSex)"
                />
              </v-flex>
              <v-spacer />
              <v-flex>
                <v-select
                  v-model="subjectGender"
                  label="Gender"
                  :items="Object.values(genderOptions)"
                  :readonly="!editable"
                  :disabled="!(editable || subjectGender)"
                />
              </v-flex>
            </v-flex>
          </v-flex>
        </v-form>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-flex shrink px-3>
        <v-switch
          v-if="existingSubject"
          v-model="editable"
          :label="editable ? 'Edit Mode' : 'View Mode'"
        />
      </v-flex>
      <v-btn flat v-if="existingSubject" color="error" @click="disassociate">
        Undo Association
      </v-btn>
      <v-spacer />
      <v-btn
        flat
        v-if="editable && existingSubject"
        color="warning"
        @click="updateSubject(subject)"
      >
        Update
      </v-btn>
      <v-btn
        flat
        v-if="!existingSubject && radioGroup == 'new'"
        color="success"
        @click="associateNewSubject"
      >
        Create
      </v-btn>
      <v-btn
        flat
        v-if="!existingSubject && radioGroup == 'existing'"
        color="success"
        @click="associateExistingSubject"
        :disabled="!selectedSubject"
      >
        Associate
      </v-btn>
      <v-btn color="green darken-1" flat @click="closeDialog">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const cleanSubject = {
  idNumber: '',
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  dominantHand: null,
  sex: null,
  gender: null
}

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
    sexOptions: { M: 'Male', F: 'Female', U: 'Other' },
    genderOptions: { CIS: 'Cisgender', TRANS: 'Transgender', OTHER: 'Other' }
  }),
  computed: {
    subjectSex: {
      get: function() {
        return this.sexOptions[this.subject.sex]
      },
      set: function(newValue) {
        this.subject.sex = getKeyByValue(this.sexOptions, newValue)
      }
    },
    subjectGender: {
      get: function() {
        return this.genderOptions[this.subject.gender]
      },
      set: function(newValue) {
        this.subject.gender = getKeyByValue(this.genderOptions, newValue)
      }
    },
    selectedSubject: function() {
      return this.subjects.find(
        subject =>
          this.getSubjectRepresentation(subject) ==
          this.selectedSubjectRepresentation
      )
    },
    formattedDate: function() {
      return formatDate(this.subject.dateOfBirth)
    },
    ...mapState('research', ['subjects'])
  },
  watch: {
    editable: function(isEditable) {
      if (!isEditable) {
        this.subject = Object.assign({}, this.existingSubject)
      }
    }
  },
  methods: {
    closeDialog() {
      if (this.existingSubject && this.editable) this.editable = false
      this.$emit('close-subject-dialog')
    },
    associateNewSubject() {
      this.createSubject(this.subject)
        .then(result => this.$emit('associate-patient', result))
        .then((this.editable = false))
        .then(this.closeDialog())
    },
    associateExistingSubject() {
      this.$emit('associate-patient', this.selectedSubject)
    },
    disassociate() {
      this.$emit('disassociate-patient')
      this.subject = Object.assign({}, cleanSubject)
    },
    getSubjectRepresentation(subject) {
      let rep = `Subject #${subject.id}`
      if (subject.firstName && subject.lastName) {
        rep = rep.concat(` [${subject.firstName} ${subject.lastName}]`)
      }
      return rep
    },
    ...mapActions('research', ['createSubject', 'updateSubject'])
  }
}

function formatDate(date) {
  if (!date) return null

  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}
</script>

<style lang="scss" scoped>
/deep/ label {
  margin-bottom: 0rem;
}
</style>
