<template>
  <v-card v-if="!deleteWanted">
    <!-- Title -->
    <v-card-title class="success darken-3">
      <div>
        <span class="white--text">
          Subject Information
        </span>
        <span v-if="subject.id" class="grey--text text--lighten-1">
          {{ `#${subject.id}` }}
        </span>
      </div>
      <v-spacer />

      <!-- Delete Button -->
      <v-icon
        v-if="existingSubject && editable && currentUser.isStaff"
        style="cursor: pointer;"
        @click="verifyDelete"
      >
        delete
      </v-icon>
    </v-card-title>

    <!-- Body -->
    <v-card-text>
      <v-col>
        <v-form @submit.prevent="submit">
          <v-text-field
            label="ID Number"
            v-model="subject.idNumber"
            :counter="64"
            :readonly="!editable"
          />

          <!-- First Name -->
          <v-text-field
            label="First Name"
            v-if="(existingSubject || subjectId) && !editable"
            v-model="subject.firstName"
            :counter="64"
            :readonly="!editable"
          />
          <v-text-field
            append-outer-icon="casino"
            label="First Name"
            v-else
            v-model="subject.firstName"
            :counter="64"
            :readonly="!editable"
            @click:append-outer="generateFirstName"
          />

          <!-- Last Name -->
          <v-text-field
            label="Last Name"
            v-if="(existingSubject || subjectId) && !editable"
            v-model="subject.lastName"
            :counter="64"
            :readonly="!editable"
          />
          <v-text-field
            append-outer-icon="casino"
            label="Last Name"
            v-else
            v-model="subject.lastName"
            :counter="64"
            :readonly="!editable"
            @click:append-outer="generateLastName"
          />

          <!-- Dominant Hand -->
          <v-select
            label="Dominant Hand"
            v-model="subject.dominantHand"
            :clearable="editable"
            :items="dominantHandItems"
            :readonly="!editable"
          />

          <!-- Sex -->
          <v-select
            :clearable="editable"
            label="Sex"
            v-model="subject.sex"
            :items="sexItems"
            :readonly="!editable"
          />

          <!-- Gender -->
          <v-select
            label="Gender"
            v-model="subject.gender"
            :clearable="editable"
            :items="genderItems"
            :readonly="!editable"
          />

          <!-- Date of Birth -->
          <v-menu v-model="dob_menu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Date of Birth"
                prepend-icon="cake"
                v-model="formattedDate"
                v-on="on"
                :clearable="editable"
                :readonly="!editable"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="subject.dateOfBirth"
              @input="dob_menu = false"
            ></v-date-picker>
          </v-menu>
          <!-- <br />
          <object-table
            title="Custom attributes"
            :editable="editable"
            :existingObject="subject.customAttributes"
            @update-object="updateCustomAttributes"
          /> -->
        </v-form>
      </v-col>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions>
      <!-- View/Edit mode switch -->
      <div v-if="currentUser.isStaff" px-3>
        <v-switch
          v-if="!createMode"
          v-model="editable"
          :label="editable ? 'Edit Mode' : 'View Mode'"
        />
      </div>
      <v-spacer />

      <!-- Update -->
      <v-btn
        color="warning"
        text
        v-if="editable && (existingSubject.id || subjectId)"
        :disabled="!currentUser.isStaff"
        @click="updateExistingSubject"
      >
        Update
      </v-btn>

      <!-- Create -->
      <v-btn
        color="success"
        text
        v-if="!existingSubject.id && !subjectId && currentUser.isStaff"
        @click="createNewSubject"
      >
        Create
      </v-btn>

      <!-- Cancel -->
      <v-btn color="error" text @click="closeDialog">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
  <deleteDialog
    v-else
    :action="deleteSubject"
    :input="subject"
    @close-dialog="deleteWanted = false"
  />
</template>

<script>
import faker from 'faker'
import { mapActions, mapState } from 'vuex'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { createSelectItems } from '@/components/utils'
// import ObjectTable from '@/components/object-table.vue'
import deleteDialog from '@/components/deleteDialog.vue'

export default {
  name: 'SubjectInfoCard',
  components: { deleteDialog },
  props: {
    existingSubject: {
      type: Object,
      default: () => Object.assign({}, cleanSubject)
    },
    subjectId: { type: Number, default: 0 },
    editMode: { type: Boolean, default: false }
  },
  created() {
    if (this.existingSubject.id != undefined) {
      this.subject = Object.assign({}, this.existingSubject)
    } else if (this.subjectId != 0) {
      this.fetchSubjectById()
    }
    this.editable = this.createMode || this.editMode
  },
  data: () => ({
    selectedSubjectRepresentation: '',
    subject: Object.assign({}, cleanSubject),
    editable: false,
    dob_menu: false,
    radioGroup: 'new',
    sexItems: createSelectItems(sexOptions),
    genderItems: createSelectItems(genderOptions),
    dominantHandItems: createSelectItems(dominantHandOptions),
    deleteWanted: false,
    options: {
      page: 1,
      sortBy: ['date', 'time'],
      sortDesc: [true, false],
      itemsPerPage: 25
    }
  }),
  computed: {
    createMode: function() {
      return !(this.existingSubject.id || this.subjectId)
    },
    formattedDate: function() {
      return formatDate(this.subject.dateOfBirth)
    },
    ...mapState('research', ['subjects']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    createSelectItems,
    closeDialog() {
      if ((this.existingSubject || this.subjectId) && this.editable)
        this.editable = false
      this.$emit('close-subject-dialog')
    },
    undefinedToNull() {
      let keys = Object.keys(this.subject)
      keys.forEach(key => {
        if (this.subject[key] === undefined) {
          this.subject[key] = null
        }
      })
    },
    updateExistingSubject() {
      this.undefinedToNull()
      this.updateSubject(this.subject)
        .then(data => (this.subject = Object.assign({}, data)))
        .then(this.closeDialog())
    },
    createNewSubject() {
      this.createSubject(this.subject)
        .then(() => (this.editable = false))
        .then(() => (this.subject = Object.assign({}, cleanSubject)))
        .then(this.closeDialog())
    },
    getSubjectRepresentation(subject) {
      let rep = `Subject #${subject.id}`
      if (subject.firstName && subject.lastName) {
        rep = rep.concat(` [${subject.firstName} ${subject.lastName}]`)
      }
      return rep
    },
    generateFirstName() {
      this.subject.firstName = faker.name.firstName()
    },
    generateLastName() {
      this.subject.lastName = faker.name.lastName()
    },
    updateCustomAttributes(updatedAttributes) {
      this.subject.customAttributes = updatedAttributes
    },
    verifyDelete() {
      this.deleteWanted = true
    },
    fetchSubjectById() {
      let filters = { id: this.subjectId }
      let query = { filters: filters, options: this.options }
      this.fetchSubjects(query).then(() => {
        this.subject = Object.assign({}, this.subjects[0])
      })
    },
    ...mapActions('research', [
      'fetchSubjects',
      'createSubject',
      'updateSubject',
      'deleteSubject'
    ])
  },
  watch: {
    createMode: function(subjectCreation) {
      this.editable = subjectCreation
    },
    editable: function(isEditable) {
      if (!isEditable) {
        if (this.subjectId == 0) {
          this.subject = Object.assign({}, this.existingSubject)
        } else if (this.subjectId != 0) {
          this.fetchSubjectById()
        }
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
  gender: null,
  customAttributes: {}
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
