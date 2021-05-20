<template>
  <v-col>
    <v-row>
      <!-- Key -->
      <v-col>
        <v-text-field clearable v-model="filters.key" label="Key" />
      </v-col>
      <!-- Type -->
      <v-col>
        <v-select
          v-model="filters.outputType"
          :items="typeChoices"
          label="Type"
          clearable
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RunOutputControls',
  props: {
    options: Object,
    selected: Array,
    run: { type: Object, default: null }
  },
  created() {
    if (this.run != null) {
      this.$set(this.filters, 'run', this.run.id)
    }
  },
  mounted() {
    this.update()
  },
  data: () => ({
    filters: {
      key: '',
      outputType: ''
    },
    typeChoices: [
      { value: 'FLT', text: 'Float' },
      { value: 'FIL', text: 'File' },
      { value: 'LST', text: 'List' }
    ]
  }),
  computed: {},
  methods: {
    update() {
      this.$emit('fetch-outputs-start')
      let query = { filters: this.filters, options: this.options }
      this.fetchOutputs(query).then(() => {
        this.$emit('fetch-outputs-end')
      })
    },
    ...mapActions('analysis', ['fetchOutputs'])
  },
  watch: {
    run: function(selectedRun) {
      this.$set(this.filters, 'run', selectedRun.id)
      this.update()
    },
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
