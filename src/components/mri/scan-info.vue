<template>
  <v-card>
    <v-card-title class="green darken-3">
      <div class="headline">
        <span class="white--text">
          Scan Information
        </span>
        <span class="grey--text text--lighten-1">
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
          />
        </v-layout>
        <v-layout row wrap>
          <v-text-field
            v-model="scan.description"
            id="description-input"
            type="text"
            label="Description"
            hint="A description of the type of scan acquired."
          />
          <v-spacer />
          <v-text-field
            v-model="sequenceType"
            id="sequence-type-input"
            type="text"
            label="Sequence Type"
            hint="A unique combination of scanning sequence and variant."
            readonly
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
                  disabled
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="scanDate"
                @input="dateMenu = false"
                :max="new Date().toISOString().substr(0, 10)"
                readonly
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
                  disabled
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
                disabled
              />
            </v-menu>
          </v-flex>
          <v-spacer />
          <v-flex pl-3>
            <v-text-field
              v-model="scan.number"
              id="number-input"
              type="number"
              label="Acquisition Number"
              hint="A number identifying this scan within its acquisition session."
              disabled
            />
          </v-flex>
        </v-layout>

        <v-layout row wrap>
          <v-textarea
            name="comments-input"
            label="Comments"
            value=""
            hint="Anything noteworty about this scan or its acquisition."
          />
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

const cleanScan = {
  institutionName: '',
  description: '',
  sequenceType: null,
  number: null,
  comments: null
}

export default {
  name: 'ScanInfo',
  props: {
    scanInstance: Object,
    dicom: Object
  },
  // created() {
  //   if (this.scanInstance) {
  //     this.scan = this.scanInstance
  //   } else {
  //     this.getOrCreateScanInfoFromDicomSeries(this.dicom)
  //     this.scan = this.scanInfo
  //   }
  // },
  data: () => ({
    dateMenu: null,
    timeMenu: null
    // scan: null
  }),
  computed: {
    scanDate: function() {
      return new Date(this.scan.time).toISOString().substr(0, 10)
    },
    scanTime: function() {
      return new Date(this.scan.time).toISOString().substr(11)
    },
    sequenceType: function() {
      return this.getSequenceTypeByUrl(this.scan.sequenceType)
    },
    ...mapGetters('mri', ['getSequenceTypeByUrl']),
    ...mapState('mri', ['scanInfo'])
  },
  methods: {
    ...mapActions('mri', ['getOrCreateScanInfoFromDicomSeries'])
  }
}
</script>

<style lang="scss" scoped></style>
