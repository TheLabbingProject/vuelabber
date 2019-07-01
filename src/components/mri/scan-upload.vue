<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>
        <input
          accept=".dcm, .zip"
          id="files"
          ref="files"
          type="file"
          multiple
          @change="handleFileUploads()"
        />
      </label>
      <div class="text-left caption">
        {{ fileProgressLabel }}
      </div>
      <v-progress-linear v-model="fileUploadPercentage" />
      <div class="text-left caption">
        {{ totalProgressLabel }}
      </div>
      <v-progress-linear v-model="totalUploadPercentage" />
      <v-btn small @click="submitFiles()">
        Upload
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'ScanUpload',
  props: { subject: Object },
  data: () => ({
    form: null,
    files: null,
    fileUploadPercentage: 0,
    totalUploadPercentage: 0,
    fileProgressLabel: 'File progress',
    totalProgressLabel: 'Total progress'
  }),
  methods: {
    /*
      Handles a change on the file upload
    */
    handleFileUploads() {
      this.files = this.$refs.files.files
    },
    /*
      Submits the file to the server
    */
    async submitFiles() {
      /*
        Iteate over any file sent over appending the files
        to the form data.
      */
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]

        /*
          Initialize the form data
        */
        let formData = new FormData()

        formData.append('file', file)
        this.fileProgressLabel = `Uploading ${file.name}...`

        /*
          Make the PUT request to the file upload endpoint
        */
        await this.submitFile(formData).then(
          function() {
            this.totalUploadPercentage = parseInt(
              Math.round((i * 100) / this.files.length)
            )
            this.fileProgressLabel = `${file.name} successfully uploaded!`
            this.totalProgressLabel = `Total progress ( ${i + 1} / ${
              this.files.length
            } )`
          }.bind(this)
        )
      }
      this.$refs.files.value = ''
      this.files = null
      this.fileUploadPercentage = 0
      this.totalUploadPercentage = 0
      this.fileProgressLabel = 'File progress'
      this.totalProgressLabel = 'Total progress'
      this.fetchSubjectScans(this.subject)
    },
    submitFile(formData) {
      return axios
        .put(`/api/mri/scan/from_dicom/${this.subject.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function(progressEvent) {
            this.fileUploadPercentage = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          }.bind(this)
        })
        .catch(console.error)
    },
    ...mapActions('mri', ['fetchSubjectScans'])
  }
}
</script>

<style lang="scss" scoped></style>
