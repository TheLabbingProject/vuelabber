<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">
        {{ exportDialogTitle }}
      </span>
    </v-card-title>

    <v-card-text>
      <v-container fluid>
        <v-col class="py-0">
          <v-row align="center">
            <div class="pl-0 pt-1 text-h6">
              Export Destination
            </div>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-autocomplete
                v-model="selectedExportDestination"
                multiple
                item-value="id"
                item-text="title"
                :label="selectDestinationLabel"
                :items="exportDestinations"
                :loading="loadingExportDestinations"
                @focus="fetchDestinations"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close">
        Cancel
      </v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="exportRun"
        :disabled="exportDisabled"
      >
        Export
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'ExportRunCard',
  props: { selectedRuns: { type: Array } },
  created() {
    this.fetchExportDestinations({ filters: {}, options: {} })
  },
  data: () => ({
    exportDialogTitle: 'Export Run Results',
    loadingExportDestinations: false,
    selectDestinationLabel: 'Select destination',
    selectedExportDestination: null
  }),
  computed: {
    exportDestinationQuery() {
      let filters = { users: [this.currentUser.id] }
      return { options: {}, filters: filters }
    },
    exportDisabled() {
      return !this.selectedExportDestination
    },
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    close() {
      this.$emit('close-run-export-dialog')
    },
    fetchDestinations() {
      this.loadingExportDestinations = true
      this.fetchExportDestinations(this.exportDestinationQuery).then(
        () => (this.loadingExportDestinations = false)
      )
    },
    exportRun() {
      let data = {
        export_destination_id: this.selectedExportDestination,
        app_label: 'django_analyses',
        model_name: 'Run',
        instance_id: this.selectedRuns.map(run => run.id)
      }
      this.exportDataInstance(data)
        .then(() => {
          this.$emit(
            'run-export-started',
            this.selectedRuns.length,
            this.selectedExportDestination.length
          )
        })
        .then(() => this.close())
    },
    ...mapActions('accounts', ['fetchExportDestinations', 'exportDataInstance'])
  }
}
</script>

<style></style>
