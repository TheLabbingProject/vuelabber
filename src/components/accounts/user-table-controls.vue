<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field label="Username" v-model="filters.username" />
      </v-col>
      <v-col>
        <v-text-field
          label="Last Name"
          v-model="filters.lastName"
          :disabled="Boolean(filters.id)"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="First Name"
          v-model="filters.firstName"
          :disabled="Boolean(filters.id)"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Email"
          v-model="filters.email"
          :disabled="Boolean(filters.id)"
        />
      </v-col>
      <v-col>
        <v-autocomplete
          :disabled="Boolean(filters.id)"
          :items="institutionNames"
          v-model="filters.institute"
          label="Institute"
          clearable
          multiple
        ></v-autocomplete>
      </v-col>
      <v-col v-if="user.isStaff" cols="1">
        <v-dialog v-model="addCollaboratorDialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="info" v-bind="attrs" v-on="on">
              Add
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Add Collaborators
            </v-card-title>
            <v-card-text>
              <v-autocomplete
                multiple
                v-model="newCollaborators"
                :items="potentialCollaborators"
                item-value="pk"
                item-text="username"
              >
              </v-autocomplete>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="addCollaboratorDialog = false">
                Cancel
              </v-btn>
              <v-btn color="primary" text @click="updateCollaborators">
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserTableControls',
  props: { options: Object, study: Object },
  mounted() {
    if (this.study) {
      this.filters.study = this.study.id
    }
    this.update()
  },
  data: () => ({
    filters: {
      username: '',
      firstName: '',
      lastName: '',
      institute: [],
      study: ''
    },
    addCollaboratorDialog: false,
    newCollaborators: []
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    ...mapState('accounts', ['institutionNames', 'potentialCollaborators']),
    ...mapState('auth', ['user'])
  },
  methods: {
    update() {
      this.fetchInstitutionNames()
      this.$emit('fetch-users-start')
      this.fetchUsers(this.query).then(() => {
        this.$emit('fetch-users-end')
      })
    },
    updateCollaborators() {
      let updatedStudy = Object.assign({}, this.study)
      updatedStudy.collaborators = updatedStudy.collaborators.concat(
        this.newCollaborators
      )
      this.patchStudy(updatedStudy).then(() => {
        this.addCollaboratorDialog = false
        this.update()
      })
    },
    ...mapActions('accounts', [
      'fetchInstitutionNames',
      'fetchUsers',
      'fetchPotentialCollaborators'
    ]),
    ...mapActions('research', ['patchStudy'])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    options: {
      handler() {
        this.update()
      },
      deep: true
    },
    addCollaboratorDialog: function(value) {
      if (value) {
        this.fetchPotentialCollaborators(this.study.id)
      } else {
        this.newCollaborators = []
      }
    }
  }
}
</script>

<style scoped></style>
