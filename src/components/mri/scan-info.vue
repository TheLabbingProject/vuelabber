<template>
  <v-card>
    <v-card-title class="green darken-3">
      <div class="headline">
        <span class="white--text">
          Scan Information
        </span>
        <span v-if="existingScan" class="grey--text text--lighten-1">
          {{ `#${scan.id}` }}
        </span>
      </div>
    </v-card-title>
    <v-card-text>
      <v-container p-3>
        <v-layout row wrap>
          <v-text-field
            v-model="scan.institutionName"
            id="institution-name-input"
            type="text"
            label="Institution Name"
            hint="Where was this scan acquired?"
            :readonly="!editable"
          />
        </v-layout>
        <v-layout row wrap>
          <v-text-field
            v-model="scan.number"
            id="number-input"
            type="number"
            label="Acquisition Number"
            hint="A number identifying this scan within its acquisition session."
            :readonly="!editable"
          />
          <v-spacer />
          <v-text-field
            v-model="scan.description"
            id="description-input"
            type="text"
            label="Description"
            hint="A description of the type of scan acquired."
            :readonly="!editable"
          />
          <v-spacer />
          <v-select
            v-model="sequenceType"
            label="Sequence Type"
            hint="A unique combination of scanning sequence and variant."
            :items="sequenceTypes.map(sequence => sequence.title)"
            :readonly="!editable"
          />
        </v-layout>

        <v-layout row wrap>
          <v-flex>
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="scanDate"
                  label="Acquisition Date"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="scanDate"
                @input="dateMenu = false"
                :max="new Date().toISOString().substr(0, 10)"
                :readonly="!editable"
              />
            </v-menu>
          </v-flex>
          <v-spacer />
          <v-flex pl-3>
            <v-menu
              ref="timeMenuRef"
              v-model="timeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="scanTime"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="scanTime"
                  label="Acquisition Time"
                  prepend-icon="access_time"
                  readonly
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-if="timeMenu"
                v-model="scanTime"
                format="24hr"
                @click:minute="$refs.timeMenuRef.save(time)"
                use-seconds
                full-width
                :readonly="!editable"
              />
            </v-menu>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-textarea
            name="comments-input"
            label="Comments"
            v-model="scan.comments"
            hint="Anything noteworty about this scan or its acquisition."
            :readonly="!editable"
          />
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-flex shrink px-3>
        <v-switch
          v-if="existingScan"
          v-model="editable"
          :label="editable ? 'Edit Mode' : 'View Mode'"
        />
      </v-flex>
      <v-btn
        flat
        v-if="existingScan && editable"
        color="error"
        @click="deleteExistingScan"
      >
        Delete
      </v-btn>
      <v-spacer />
      <v-btn
        flat
        v-if="editable && existingScan"
        color="warning"
        @click="updateExistingScan(scan)"
      >
        Update
      </v-btn>
      <v-btn
        flat
        v-if="!existingScan && radioGroup == 'new'"
        color="success"
        @click="createNewScan"
      >
        Create
      </v-btn>
      <v-btn color="green darken-1" flat @click="closeDialog">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

const cleanScan = {
  institutionName: '',
  description: '',
  sequenceType: null,
  number: null,
  comments: null,
  subject: null
}

export default {
  name: 'ScanInfo',
  props: {
    existingScan: Object,
    dicom: Object
  },
  created() {
    this.initializeScan()
    if (this.dicom) this.fetchPatients()
  },
  data: () => ({
    radioGroup: 'new',
    dateMenu: null,
    timeMenu: null,
    scan: Object.assign({}, cleanScan),
    editable: false
  }),
  computed: {
    scanDate: function() {
      let time = this.scan.time
      return time ? new Date(time).toISOString().substr(0, 10) : null
    },
    scanTime: function() {
      let time = this.scan.time
      return time ? new Date(time).toISOString().substr(11) : null
    },
    sequenceType: function() {
      let type = this.getSequenceTypeByUrl(this.scan.sequenceType)
      return type ? type.title : null
    },
    ...mapState('mri', ['sequenceTypes']),
    ...mapGetters('mri', ['getSequenceTypeByUrl'])
  },
  methods: {
    closeDialog() {
      if (this.existingScan && this.editable) this.editable = false
      this.$emit('close-scan-dialog')
    },
    updateScanFromDicomInfo(data) {
      this.scan = data
      delete this.scan.studyGroups
      delete this.scan.id
      delete this.scan.nifti
      delete this.scan.url
      this.scan.dicom = this.dicom.url
    },
    createNewScan() {
      this.createScan(this.scan).then(() => {
        this.editable = false
      })
    },
    updateExistingScan() {
      this.updateScan(this.scan).then(() => {
        this.editable = false
        this.closeDialog()
      })
    },
    deleteExistingScan() {
      this.deleteScan(this.scan).then(() => {
        this.initializeScan()
        this.closeDialog()
      })
    },
    initializeScan() {
      if (this.existingScan) {
        this.scan = Object.assign({}, this.existingScan)
        this.editable = false
      } else if (this.dicom) {
        this.getOrCreateScanInfoFromDicomSeries(this.dicom).then(data => {
          this.updateScanFromDicomInfo(data)
        })
        this.editable = true
      } else {
        this.scan = Object.assign({}, cleanScan)
        this.editable = true
      }
    },
    ...mapActions('mri', [
      'getOrCreateScanInfoFromDicomSeries',
      'createScan',
      'updateScan',
      'deleteScan'
    ]),
    ...mapActions('dicom', ['fetchPatients'])
  },
  watch: {
    editable: function(isEditable) {
      if (!isEditable) {
        this.scan = Object.assign({}, this.existingScan)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ label {
  margin-bottom: 0rem;
}
</style>
