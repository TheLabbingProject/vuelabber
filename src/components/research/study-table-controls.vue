<template>
  <v-row class="px-4 align-left">
    <v-col :cols="1" style="max-width: 100px;">
      <v-text-field label="ID" v-model="filters.id" />
    </v-col>
    <v-col :cols="2">
      <v-text-field
        label="Title"
        v-model="filters.title"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
    <v-col>
      <v-text-field
        label="Description"
        v-model="filters.description"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SubjectTableControls',
  props: { options: Object },
  created() {
    this.fetchStudies({ filters: this.filters, options: this.options })
  },
  data: () => ({
    bornAfterMenu: false,
    bornBeforeMenu: false,
    filters: {
      id: '',
      title: '',
      description: ''
    }
  }),
  methods: {
    update() {
      this.$emit('fetch-studies-start')
      let query = { filters: this.filters, options: this.options }
      this.fetchStudies(query).then(() => {
        this.$emit('fetch-studies-end')
      })
    },
    ...mapActions('research', ['fetchStudies'])
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
