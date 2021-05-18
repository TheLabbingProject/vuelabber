<template>
  <v-col>
    <v-row>
      <!-- Key -->
      <v-col :cols="3">
        <v-text-field clearable v-model="filters.key" label="Key" />
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
      key: ''
    }
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
