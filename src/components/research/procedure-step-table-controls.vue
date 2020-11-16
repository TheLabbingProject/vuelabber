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
  name: 'ProcedureStepTableControls',
  props: {
    options: Object,
    procedure: Object,
    showControls: { type: Boolean, default: true }
  },
  created() {
    if (this.procedure) {
      this.filters.procedure = this.procedure.id
    }
    this.update()
  },
  data: () => ({
    filters: {
      id: '',
      index: '',
      title: '',
      description: '',
      procedure: ''
    }
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    }
  },
  methods: {
    update() {
      this.$emit('fetch-procedure-steps-start')
      this.fetchProcedureSteps(this.query).then(() => {
        this.$emit('fetch-procedure-steps-end')
      })
    },
    ...mapActions('research', ['fetchProcedureSteps'])
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
