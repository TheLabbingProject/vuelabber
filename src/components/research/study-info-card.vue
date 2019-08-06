<template>
  <v-card>
    <v-card-title class="headline green darken-3 white--text">
      Create New Study
    </v-card-title>
    <v-card-text>
      <v-layout wrap column>
        <v-form @submit.prevent="submit">
          <v-flex pb-4>
            <v-text-field
              v-model="study.title"
              label="Title"
              :class="{ hasError: $v.study.title.$error }"
              :counter="255"
              :error-messages="titleErrors"
              @blur="$v.study.$touch()"
            />
          </v-flex>
          <v-flex>
            <v-textarea v-model="study.description" label="Description" />
          </v-flex>
          <v-flex pb-4>
            <v-combobox
              v-model="selectedCollaborators"
              label="Collaborators"
              chips
              multiple
              :items="possibleCollaborators"
            />
          </v-flex>
        </v-form>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="warning"
        flat
        v-if="existingStudy"
        :disabled="$v.study.$error"
        @click="updateExistingStudy"
        >Update</v-btn
      >
      <v-btn
        color="success"
        flat
        v-else
        :disabled="$v.study.$error"
        @click="createNewStudy"
        >Create</v-btn
      >
      <v-btn color="info" flat @click="$emit('close-study-dialog')"
        >Cancel</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'StudyInfoCard',
  props: {
    existingStudy: { type: Object }
  },
  created() {
    this.study = cloneStudy(this.existingStudy)
    this.$store.dispatch('accounts/fetchProfiles')
    this.selectedCollaborators = this.study.collaborators.map(collaborator =>
      this.getCollaboratorName(this.getProfileByUserUrl(collaborator))
    )
  },
  mixins: [validationMixin],
  computed: {
    data: () => ({
      selectedCollaborators: []
    }),
    possibleCollaborators: function() {
      return this.profiles.map(user => this.getCollaboratorName(user))
    },
    titleErrors: function() {
      const errors = []
      if (!this.$v.study.title.$dirty) return errors
      !this.$v.study.title.maxLength &&
        errors.push('Title must be at most 255 characters long!')

      !this.$v.study.title.required && errors.push('Title is required.')
      return errors
    },
    ...mapState('accounts', ['profiles']),
    ...mapGetters('accounts', ['getUserByUsername', 'getProfileByUserUrl'])
  },
  validations: {
    study: {
      title: { required, maxLength: maxLength(255) }
    }
  },
  methods: {
    getCollaboratorName: user =>
      `${user.user.first_name} ${user.user.last_name} [${user.user.username}]`,
    parseCollaboratorUsername: collaborator =>
      collaborator.split('[')[1].slice(0, -1),
    getUserFromCollaboratorChoice: function(collaborator) {
      let username = this.parseCollaboratorUsername(collaborator)
      return this.getUserByUsername(username)
    },
    fixCollaboratorsProperty: function() {
      this.study.collaborators = this.selectedCollaborators.map(
        collaborator =>
          this.getUserFromCollaboratorChoice(collaborator).user.url
      )
    },
    closeDialog: function() {
      this.$emit('select-study', this.study.title)
      this.study = Object.assign({}, cleanStudy)
      this.$v.$reset()
      this.$emit('close-study-dialog')
    },
    createNewStudy: function() {
      this.$v.study.$touch()
      if (this.$v.study.$error) return
      this.fixCollaboratorsProperty()
      this.createStudy(this.study).then(this.closeDialog())
    },
    updateExistingStudy() {
      this.$v.study.$touch()
      if (this.$v.study.$error) return
      this.fixCollaboratorsProperty()
      this.updateStudy(this.study).then(this.closeDialog())
    },
    ...mapActions('research', ['createStudy', 'updateStudy'])
  }
}

const cleanStudy = {
  title: null,
  description: null,
  collaborators: [],
  subjects: []
}

function cloneStudy(value) {
  if (value) {
    return Object.assign({}, value)
  } else {
    return Object.assign({}, cleanStudy)
  }
}
</script>

<style scoped></style>
