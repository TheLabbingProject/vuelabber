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
              File Format
            </div>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-checkbox
                v-model="dicomExportCheckbox"
                :label="dicomExportCheckboxLabel"
                dense
                class="py-0"
              />
              <v-checkbox
                v-model="niftiExportCheckbox"
                :label="niftiExportCheckboxLabel"
                dense
                class="py-0"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-container>
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
        @click="exportScan"
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
  name: 'ExportScanCard',
  props: { selectedScans: { type: Array } },
  created() {
    this.fetchExportDestinations({ filters: {}, options: {} })
  },
  data: () => ({
    exportDialogTitle: 'Export MRI Scan',
    dicomExportCheckbox: false,
    dicomExportCheckboxLabel: 'DICOM',
    niftiExportCheckbox: true,
    niftiExportCheckboxLabel: 'NIfTI',
    loadingExportDestinations: false,
    selectDestinationLabel: 'Select destination',
    selectedExportDestination: null
  }),
  computed: {
    exportDestinationQuery() {
      let filters = { users: [this.currentUser.id] }
      return { options: {}, filters: filters }
    },
    fileFormatSelected() {
      return this.dicomExportCheckbox || this.niftiExportCheckbox
    },
    exportDisabled() {
      return !(this.fileFormatSelected && this.selectedExportDestination)
    },
    fileFormat() {
      let fileFormat = []
      if (this.dicomExportCheckbox) {
        fileFormat.push('dicom')
      }
      if (this.niftiExportCheckbox) {
        fileFormat.push('nifti')
      }
      return fileFormat
    },
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    close() {
      this.$emit('close-scan-export-dialog')
    },
    fetchDestinations() {
      this.loadingExportDestinations = true
      this.fetchExportDestinations(this.exportDestinationQuery).then(
        () => (this.loadingExportDestinations = false)
      )
    },
    exportScan() {
      let data = {
        export_destination_id: this.selectedExportDestination,
        app_label: 'django_mri',
        model_name: 'Scan',
        instance_id: this.selectedScans.map(scan => scan.id),
        file_format: this.fileFormat
      }
      this.exportDataInstance(data)
        .then(() => {
          this.$emit(
            'scan-export-started',
            this.selectedScans.length,
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
