<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">
        {{ exportDialogTitle }}
      </span>
    </v-card-title>

    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-checkbox
            v-model="mriExportCheckbox"
            :label="mriExportCheckboxLabel"
            dense
            class="py-0"
          />
        </v-row>
        <v-col class="py-0" v-if="mriExportCheckbox">
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
        @click="exportSubject"
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
  name: 'ExportSubjectDataCard',
  props: { selectedSubjects: { type: Array } },
  created() {
    this.fetchExportDestinations({ filters: {}, options: {} })
  },
  data: () => ({
    exportDialogTitle: 'Export Subject Data',
    mriExportCheckbox: true,
    mriExportCheckboxLabel: 'MRI',
    dicomExportCheckbox: false,
    dicomExportCheckboxLabel: 'DICOM',
    niftiExportCheckbox: true,
    niftiExportCheckboxLabel: 'NIfTI',
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
      return !(
        this.mriExportCheckbox &&
        this.fileFormatSelected &&
        this.selectedExportDestination
      )
    },
    ...mapState('accounts', ['exportDestinations']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    close() {
      this.$emit('close-export-subject-dialog')
    },
    fetchDestinations() {
      this.loadingExportDestinations = true
      this.fetchExportDestinations(this.exportDestinationQuery).then(
        () => (this.loadingExportDestinations = false)
      )
    },
    exportSubject() {
      let data = {
        export_destination_id: this.selectedExportDestination,
        instance_id: this.selectedSubjects.map(subject => subject.id)
      }
      if (this.mriExportCheckbox) {
        let file_format = []
        if (this.dicomExportCheckbox) {
          file_format.push('dicom')
        }
        if (this.niftiExportCheckbox) {
          file_format.push('nifti')
        }
        data['mri'] = {
          include_json: this.jsonSidecar,
          file_format
        }
      }
      this.exportSubjectData(data).then(() => this.close())
    },
    ...mapActions('accounts', ['fetchExportDestinations']),
    ...mapActions('research', ['exportSubjectData'])
  }
}
</script>

<style></style>
