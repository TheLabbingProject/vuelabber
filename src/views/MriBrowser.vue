<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col class="pt-0">
        <v-tabs v-model="active">
          <!-- Sessions -->
          <v-tab ripple>Sessions</v-tab>
          <v-tab-item>
            <session-table />
          </v-tab-item>

          <!-- Scans -->
          <v-tab ripple>Scans</v-tab>
          <v-tab-item>
            <scan-table />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ScanTable from '@/components/mri/scan-table.vue'
import SessionTable from '@/components/mri/session-table.vue'

export default {
  name: 'MriBrowser',
  components: { ScanTable, SessionTable },
  //   mounted() {
  //     // eslint-disable-next-line
  //     EventBus.$on('session-table-ready', this.loadSessions)
  //     this.loadScans()
  //   },
  data: () => ({
    active: null
  }),
  methods: {
    next() {
      let active = parseInt(this.active)
      this.active = active < 2 ? active + 1 : 0
    },
    loadSessions() {
      // eslint-disable-next-line
      EventBus.$emit('fetch-sessions')
    },
    loadScans() {
      // eslint-disable-next-line
      EventBus.$emit('fetch-scans')
    }
  },
  watch: {
    active: function(value) {
      if (value === 0) {
        this.loadSessions()
      } else if (value === 1) {
        this.loadScans()
      }
    }
  }
}
</script>

<style scoped></style>
