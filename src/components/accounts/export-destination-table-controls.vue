<template>
  <v-row class="px-4" align="baseline">
    <v-col>
      <v-text-field label="Title" v-model="filters.title" />
    </v-col>
    <v-col>
      <v-text-field label="Description" v-model="filters.description" />
    </v-col>
    <v-col>
      <v-text-field label="IP" v-model="filters.ip" />
    </v-col>
    <v-col>
      <v-text-field label="Username" v-model="filters.username" />
    </v-col>
    <v-col>
      <v-text-field label="Destination" v-model="filters.destination" />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ExportDestinationTableControls',
  props: { options: Object, user: Object },
  mounted() {
    if (this.user) {
      this.filters.users = [this.user.id]
    }
    this.update()
  },
  data: () => ({
    filters: {
      title: '',
      description: '',
      username: '',
      destination: '',
      users: []
    }
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    update() {
      this.$emit('fetch-export-destinations-start')
      this.fetchExportDestinations(this.query).then(() => {
        this.$emit('fetch-export-destinations-end')
      })
    },
    ...mapActions('accounts', ['fetchExportDestinations'])
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
