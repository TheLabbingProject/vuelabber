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
              v-model="study.collaborators"
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
        color="green darken-1"
        flat
        @click="createStudy"
        :disabled="$v.study.$error"
        >Submit</v-btn
      >
      <v-btn color="green darken-1" flat @click="$emit('close-study-dialog')"
        >Cancel</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapGetters, mapState } from 'vuex'

const cleanStudy = {
  title: null,
  description: null,
  collaborators: [],
  subjects: []
}

export default {
  name: 'CreateStudyCard',
  created() {
    this.$store.dispatch('accounts/fetchUsers')
  },
  mixins: [validationMixin],
  data: () => ({
    study: Object.assign({}, cleanStudy)
  }),
  computed: {
    possibleCollaborators: function() {
      return this.users.map(user => this.getCollaboratorName(user))
    },
    titleErrors: function() {
      const errors = []
      if (!this.$v.study.title.$dirty) return errors
      !this.$v.study.title.maxLength &&
        errors.push('Title must be at most 255 characters long!')

      !this.$v.study.title.required && errors.push('Title is required.')
      return errors
    },
    ...mapState('accounts', ['users']),
    ...mapGetters('accounts', ['getUserByUsername'])
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
      this.study.collaborators = this.study.collaborators.map(
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
    createStudy: function() {
      this.$v.study.$touch()
      if (this.$v.study.$error) return
      this.fixCollaboratorsProperty()
      this.$store
        .dispatch('research/createStudy', this.study)
        .catch(console.error)
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped></style>
