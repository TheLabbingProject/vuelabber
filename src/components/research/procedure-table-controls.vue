<template>
  <v-row class="px-4 align-left" v-if="showControls">
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
  name: 'ProcedureTableControls',
  props: {
    options: Object,
    study: Object,
    showControls: { type: Boolean, default: true }
  },
  created() {
    if (this.study) {
      this.filters.studyId = this.study.id
    }
    this.update()
  },
  data: () => ({
    filters: {
      id: '',
      title: '',
      description: ''
    }
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    }
  },
  methods: {
    update() {
      this.$emit('fetch-procedures-start')
      this.fetchProcedures(this.query).then(() => {
        this.$emit('fetch-procedures-end')
      })
    },
    ...mapActions('research', ['fetchProcedures'])
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
