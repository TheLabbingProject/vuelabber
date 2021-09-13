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
              <v-container v-if="niftiExportCheckbox">
                <v-row class="align-center">
                  <v-col class="py-0">
                    <v-checkbox
                      v-model="bidsFormat"
                      :label="bidsFormatLabel"
                      dense
                      class="py-0"
                    />
                    <v-checkbox
                      v-model="jsonSidecar"
                      :label="jsonSidecarLabel"
                      dense
                      class="py-0"
                    />
                  </v-col>
                </v-row>
              </v-container>
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
              <v-select
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
        @click="exportSession"
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
  name: 'ExportSessionCard',
  props: { session: { type: Object } },
  data: () => ({
    exportDialogTitle: 'Export MRI Session',
    dicomExportCheckbox: false,
    dicomExportCheckboxLabel: 'DICOM',
    niftiExportCheckbox: true,
    niftiExportCheckboxLabel: 'NIfTI',
    bidsFormat: true,
    bidsFormatLabel: 'Organize as BIDS',
    jsonSidecar: true,
    jsonSidecarLabel: 'Include JSON sidecar',
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
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    close() {
      this.$emit('close-export-dialog')
    },
    fetchDestinations() {
      this.loadingExportDestinations = true
      this.fetchExportDestinations(this.exportDestinationQuery).then(
        () => (this.loadingExportDestinations = false)
      )
    },
    exportSession() {
      let file_format = []
      if (this.dicomExportCheckbox) {
        file_format.push('dicom')
      }
      if (this.niftiExportCheckbox) {
        file_format.push('nifti')
      }
      let instanceInfo = {
        exportId: this.selectedExportDestination,
        appLabel: 'django_mri',
        modelName: 'Session',
        instanceId: this.session.id,
        parameters: { file_format, include_json: this.jsonSidecar }
      }
      this.exportDataInstance(instanceInfo).then(() => this.close())
    },
    ...mapActions('accounts', ['fetchExportDestinations', 'exportDataInstance'])
  }
}
</script>

<style></style>
