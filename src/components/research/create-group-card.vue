<template>
  <v-card>
    <v-card-title class="headline cyan darken-3 white--text">
      Create New Group
    </v-card-title>

    <v-card-text>
      <v-col>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="group.title"
            label="Title"
            :class="{ hasError: $v.group.title.$error }"
            :counter="255"
            :error-messages="titleErrors"
            @blur="$v.group.title.$touch()"
          />
          <v-textarea v-model="group.description" label="Description" />
          <v-combobox
            v-model="selectedStudyTitle"
            label="Study"
            :error-messages="studyErrors"
            :items="studies.map(study => study.title)"
            @blur="$v.selectedStudyTitle.$touch()"
          />
        </v-form>
      </v-col>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="success"
        text
        @click="createGroupCaller"
        :disabled="$v.group.$error"
      >
        Submit
      </v-btn>
      <v-btn color="error" text @click="$emit('close-group-dialog')">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'CreateGroupCard',
  created() {
    this.fetchStudies()
    this.group.study = this.selectedStudy.url
  },
  mixins: [validationMixin],
  validations: {
    group: {
      title: { required, maxLength: maxLength(255) }
    },
    selectedStudyTitle: { required }
  },
  data: () => ({
    group: Object.assign({}, cleanGroup)
  }),
  computed: {
    selectedStudyTitle: {
      get: function() {
        return this.selectedStudy.title
      },
      set: function(title) {
        this.setSelectedStudyByTitle(title)
        this.group.study = this.selectedStudy.url
      }
    },
    titleErrors: function() {
      const errors = []
      if (!this.$v.group.title.$dirty) return errors
      !this.$v.group.title.maxLength &&
        errors.push('Title must be at most 255 characters long!')
      !this.$v.group.title.required && errors.push('Title is required.')
      return errors
    },
    studyErrors: function() {
      const errors = []
      if (!this.$v.selectedStudyTitle.$dirty) return errors
      !this.$v.selectedStudyTitle.required &&
        errors.push('Study selection is required.')
      return errors
    },
    ...mapState('research', ['studies', 'selectedStudy'])
  },
  methods: {
    resetDialogState: function() {
      this.group = Object.assign({}, cleanGroup)
      this.$v.$reset()
    },
    closeDialog: function() {
      let title = this.group.title
      this.resetDialogState()
      this.$emit('close-group-dialog', title)
    },
    createGroupCaller: function() {
      this.$v.group.$touch()
      if (this.$v.group.$error) return
      this.createGroup(this.group).then(() => this.closeDialog())
    },
    ...mapActions('research', [
      'createGroup',
      'fetchStudies',
      'fetchSelectedStudyGroups'
    ]),
    ...mapMutations('research', ['setSelectedStudyByTitle'])
  }
}

const cleanGroup = {
  title: '',
  description: '',
  study: ''
}
</script>

<style scoped></style>
