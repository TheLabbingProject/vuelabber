<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">
        {{ downloadDialogTitle }}
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
                v-model="dicomDownloadCheckbox"
                :label="dicomDownloadCheckboxLabel"
                dense
                class="py-0"
              />
              <v-checkbox
                v-model="niftiDownloadCheckbox"
                :label="niftiDownloadCheckboxLabel"
                dense
                class="py-0"
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
        :href="downloadUrl"
        :disabled="downloadDisabled"
      >
        Download
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { SCANS } from '@/api/mri/endpoints.js'

export default {
  name: 'DownloadScanCard',
  props: { selectedScans: { type: Array } },
  data: () => ({
    downloadDialogTitle: 'Download MRI Scan',
    dicomDownloadCheckbox: false,
    dicomDownloadCheckboxLabel: 'DICOM',
    niftiDownloadCheckbox: true,
    niftiDownloadCheckboxLabel: 'NIfTI'
  }),
  computed: {
    fileFormatSelected() {
      return this.dicomDownloadCheckbox || this.niftiDownloadCheckbox
    },
    downloadDisabled() {
      return !this.fileFormatSelected
    },
    fileFormats() {
      let fileFormats = []
      if (this.dicomDownloadCheckbox) {
        fileFormats.push('dicom')
      }
      if (this.niftiDownloadCheckbox) {
        fileFormats.push('nifti')
      }
      return fileFormats.join(',')
    },
    selectedIdsString: function() {
      return this.selectedScans.map(scan => scan.id).join(',')
    },
    downloadUrl: function() {
      return `${SCANS}/to_zip/${this.fileFormats}/${this.selectedIdsString}/`
    },
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    close() {
      this.$emit('close-scan-download-dialog')
    }
  }
}
</script>

<style></style>
