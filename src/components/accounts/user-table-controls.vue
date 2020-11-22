<template>
  <v-row class="px-4 align-left">
    <v-col :cols="1" style="max-width: 100px;">
      <v-text-field label="ID" v-model="filters.id" />
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
      ></v-autocomplete>
    </v-col>
  </v-row>
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
      id: '',
      firstName: '',
      lastName: '',
      institute: '',
      study: ''
    }
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    ...mapState('accounts', ['institutionNames'])
  },
  methods: {
    update() {
      this.fetchInstitutionNames()
      this.$emit('fetch-users-start')
      this.fetchUsers(this.query).then(() => {
        this.$emit('fetch-users-end')
      })
    },
    ...mapActions('accounts', ['fetchInstitutionNames', 'fetchUsers'])
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
    }
  }
}
</script>

<style scoped></style>
