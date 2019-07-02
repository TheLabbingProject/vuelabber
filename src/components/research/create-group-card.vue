<template>
  <v-card>
    <v-card-title class="headline cyan darken-3 white--text">
      Create New Group
    </v-card-title>
    <v-card-text>
      <v-layout wrap column>
        <v-form @submit.prevent="submit">
          <v-flex pb-4>
            <v-text-field
              v-model="group.title"
              label="Title"
              :class="{ hasError: $v.group.title.$error }"
              :counter="255"
              :error-messages="titleErrors"
              @blur="$v.group.title.$touch()"
            />
          </v-flex>
          <v-flex>
            <v-textarea v-model="group.description" label="Description" />
          </v-flex>
          <v-flex pb-4>
            <v-combobox
              v-model="selectedStudyTitle"
              label="Study"
              :error-messages="studyErrors"
              :items="studies.map(study => study.title)"
              @blur="$v.selectedStudyTitle.$touch()"
            />
          </v-flex>
        </v-form>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="cyan darken-1"
        flat
        @click="createGroup"
        :disabled="$v.group.$error"
        >Submit</v-btn
      >
      <v-btn color="cyan darken-1" flat @click="$emit('close-group-dialog')"
        >Cancel</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'

const cleanGroup = {
  title: '',
  description: '',
  study: { title: '' }
}

export default {
  name: 'CreateGroupCard',
  created() {
    this.$store.dispatch('research/fetchStudies')
  },
  props: { selectedStudy: Object },
  mixins: [validationMixin],
  validations: {
    group: {
      title: { required, maxLength: maxLength(255) }
    },
    selectedStudyTitle: {
      required
    }
  },
  data: () => ({
    group: Object.assign({}, cleanGroup)
  }),
  computed: {
    selectedStudyTitle: {
      get: function() {
        return this.selectedStudy.title
      },
      set: function(newValue) {
        if (!newValue) return
        this.$emit('select-study', newValue)
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
    ...mapState('research', ['studies'])
  },
  methods: {
    closeDialog: function() {
      this.$emit('select-group', this.group.title)
      this.group = Object.assign({}, cleanGroup)
      this.$v.$reset()
      this.$emit('close-group-dialog')
    },
    createGroup: function() {
      this.group.study = this.selectedStudy.url
      this.$v.group.$touch()
      if (this.$v.group.$error) return
      this.$store
        .dispatch('research/createGroup', this.group)
        .catch(console.error)
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped></style>
