<template>
  <v-card v-if="!deleteWanted">
    <!-- Title -->
    <v-card-title class="success darken-3 white--text">
      <span>{{ cardTitle }}</span>
      <v-spacer />
      <v-icon
        v-if="existingStudy"
        @click="verifyStudyDelete()"
        style="cursor: pointer;"
      >
        delete
      </v-icon>
    </v-card-title>

    <!-- Body -->
    <v-card-text>
      <v-col>
        <v-form @submit.prevent="submit">
          <!-- Title -->
          <v-text-field
            label="Title"
            v-model="study.title"
            :class="{ hasError: $v.study.title.$error }"
            :counter="255"
            :error-messages="studyTitleErrors"
            @blur="checkIfValid()"
          />

          <!-- Description -->
          <v-textarea v-model="study.description" label="Description" />

          <!-- Collaborators -->
          <v-combobox
            label="Collaborators"
            v-model="selectedCollaborators"
            chips
            multiple
            :items="possibleCollaborators"
          />
        </v-form>
      </v-col>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions>
      <v-spacer />
      <!-- Create new study -->
      <v-btn
        color="success"
        text
        v-if="!existingStudy"
        :disabled="$v.study.$error"
        @click="createNewStudy"
      >
        Create
      </v-btn>

      <!-- Update existing study -->
      <v-btn
        color="warning"
        text
        v-else
        :disabled="$v.study.$error"
        @click="updateExistingStudy"
      >
        Update
      </v-btn>

      <!-- Cancel study creation/update -->
      <v-btn color="error" text @click="closeDialog()">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
  <deleteDialog
    v-else
    :action="deleteStudy"
    :input="study"
    @close-dialog="deleteWanted = false"
  />
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapGetters, mapState, mapActions } from 'vuex'
import deleteDialog from '@/components/deleteDialog.vue'

export default {
  name: 'StudyInfoCard',
  components: {
    deleteDialog
  },
  props: {
    existingStudy: { type: Object }
  },
  created() {
    this.study = cloneStudy(this.existingStudy)
    let query = { filters: {}, options: {} }
    this.fetchUsers(query).then(
      (this.selectedCollaborators = this.study.collaborators.map(collaborator =>
        this.getCollaboratorName(this.getUserByUrl(collaborator))
      ))
    )
  },
  mixins: [validationMixin],
  data: () => ({
    deleteWanted: false,
    newStudyCardTitle: 'Create New Study',
    existingStudyCardTitle: 'Edit Existing Study'
  }),
  computed: {
    data: () => ({
      selectedCollaborators: []
    }),
    possibleCollaborators: function() {
      return this.users.map(user => this.getCollaboratorName(user))
    },
    cardTitle: function() {
      return this.existingStudy
        ? this.existingStudyCardTitle
        : this.newStudyCardTitle
    },
    studyTitleErrors: function() {
      const errors = []
      if (!this.$v.study.title.$dirty) return errors
      !this.$v.study.title.maxLength &&
        errors.push('Title must be at most 255 characters long!')

      !this.$v.study.title.required && errors.push('Title is required.')
      return errors
    },
    ...mapState('accounts', ['users']),
    ...mapGetters('accounts', ['getUserByUsername', 'getUserByUrl'])
  },
  validations: {
    study: {
      title: { required, maxLength: maxLength(255) }
    }
  },
  methods: {
    getCollaboratorName: user =>
      `${user.firstName} ${user.lastName} [${user.username}]`,
    parseCollaboratorUsername: collaborator =>
      collaborator.split('[')[1].slice(0, -1),
    getUserFromCollaboratorChoice: function(collaborator) {
      let username = this.parseCollaboratorUsername(collaborator)
      return this.getUserByUsername(username)
    },
    fixCollaboratorsProperty: function() {
      this.study.collaborators = this.selectedCollaborators.map(
        collaborator => this.getUserFromCollaboratorChoice(collaborator).url
      )
    },
    closeDialog: function() {
      this.study = Object.assign({}, cleanStudy)
      this.$v.$reset()
      this.$emit('close-study-dialog')
    },
    createNewStudy: function() {
      this.$v.study.$touch()
      if (this.$v.study.$error) return
      this.fixCollaboratorsProperty()
      this.createStudy(this.study)
        .then(newStudy => this.$emit('created-study', newStudy))
        .then(() => this.closeDialog())
    },
    updateExistingStudy() {
      this.$v.study.$touch()
      if (this.$v.study.$error) return
      this.fixCollaboratorsProperty()
      this.updateStudy(this.study).then(this.closeDialog())
    },
    ...mapActions('accounts', ['fetchUsers']),
    ...mapActions('research', ['createStudy', 'updateStudy', 'deleteStudy']),
    verifyStudyDelete() {
      this.deleteWanted = true
    },
    checkIfValid() {
      this.$v.study.$dirty
        ? this.$v.study.$reset() && this.$v.study.$touch()
        : this.$v.study.$touch()
    }
  }
}

const cleanStudy = {
  title: null,
  description: null,
  collaborators: [],
  subjects: []
}

function cloneStudy(value) {
  return Object.assign({}, value || cleanStudy)
}
</script>

<style scoped></style>
