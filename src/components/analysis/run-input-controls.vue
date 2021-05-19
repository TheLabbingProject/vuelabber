<template>
  <v-col>
    <v-row>
      <!-- Key -->
      <v-col>
        <v-text-field v-model="filters.key" label="Key" clearable />
      </v-col>
      <!-- Type -->
      <v-col>
        <v-select
          v-model="filters.inputType"
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
  name: 'RunInputControls',
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
      inputType: ''
    },
    typeChoices: [
      { value: 'BLN', text: 'Boolean' },
      { value: 'DIR', text: 'Directory' },
      { value: 'FLT', text: 'Float' },
      { value: 'FIL', text: 'File' },
      { value: 'INT', text: 'Integer' },
      { value: 'LST', text: 'List' },
      { value: 'STR', text: 'String' }
    ]
  }),
  computed: {},
  methods: {
    update() {
      this.$emit('fetch-inputs-start')
      let query = { filters: this.filters, options: this.options }
      this.fetchInputs(query).then(() => {
        this.$emit('fetch-inputs-end')
      })
    },
    ...mapActions('analysis', ['fetchInputs'])
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
