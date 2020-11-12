<template>
  <v-card v-if="!deleteWanted">
    <v-card-title class="success darken-3">
      <div class="title">
        <span class="white--text">Scan Information</span>
        <span v-if="existingScan" class="grey--text text--lighten-1">{{
          `#${scan.id}`
        }}</span>
      </div>
    </v-card-title>

    <v-card-text>
      <v-col>
        <!-- Institution Name -->
        <v-text-field
          v-model="scan.institutionName"
          label="Institution Name"
          hint="Where was this scan acquired?"
          :readonly="!editable"
        />

        <!-- Scan Number -->
        <v-text-field
          v-model="scan.number"
          type="number"
          label="Acquisition Number"
          hint="A number identifying this scan within its acquisition session."
          :readonly="!editable"
        />

        <!-- Description -->
        <v-text-field
          v-model="scan.description"
          label="Description"
          hint="A description of the type of scan acquired."
          :readonly="!editable"
        />

        <!-- Sequence Type -->
        <v-select
          v-model="scan.sequenceType"
          label="Sequence Type"
          hint="A unique combination of scanning sequence and variant."
          :disabled="Boolean(existingScan)"
          :items="sequenceTypeItems"
          :readonly="!editable"
        />

        <!-- Date -->
        <v-menu v-model="dateMenu" :close-on-content-click="false">
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

        <!-- Time -->
        <v-menu
          ref="timeMenuRef"
          v-model="timeMenu"
          :close-on-content-click="false"
          :return-value.sync="scanTime"
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
            :readonly="!editable"
          />
        </v-menu>

        <!-- Comments -->
        <v-textarea
          name="comments-input"
          label="Comments"
          v-model="scan.comments"
          hint="Anything noteworty about this scan or its acquisition."
          :readonly="!editable"
        />
      </v-col>
    </v-card-text>

    <v-card-actions>
      <v-col>
        <!-- View / Edit Mode switch -->
        <v-switch
          v-if="existingScan"
          v-model="editable"
          :label="editable ? 'Edit Mode' : 'View Mode'"
        />

        <v-row class="align-center">
          <!-- Delete button -->
          <v-btn
            text
            v-if="existingScan && editable"
            color="error"
            @click="verifyDelete"
            >Delete</v-btn
          >

          <v-spacer />

          <!-- Update button -->
          <v-btn
            text
            v-if="editable && existingScan"
            color="warning"
            @click="updateExistingScan(scan)"
            >Update</v-btn
          >

          <!-- Cancel button -->
          <v-btn
            text
            v-if="!existingScan && radioGroup == 'new'"
            color="success"
            @click="createNewScan"
            >Create</v-btn
          >
          <v-btn color="green darken-1" text @click="closeDialog">Cancel</v-btn>
        </v-row>
      </v-col>
    </v-card-actions>
  </v-card>
  <deleteDialog
    v-else
    :action="deleteExistingScan"
    :input="scan"
    @close-dialog="deleteWanted = false"
  />
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { createSelectItems } from '@/components/utils'
import deleteDialog from '@/components/deleteDialog.vue'

export default {
  name: 'ScanInfo',
  props: {
    existingScan: Object
  },
  components: { deleteDialog },
  created() {
    this.initializeScan()
  },
  data: () => ({
    radioGroup: 'new',
    dateMenu: null,
    timeMenu: null,
    scan: Object.assign({}, cleanScan),
    editable: false,
    deleteWanted: false
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
    sequenceTypeItems: function() {
      return createSelectItems(this.sequenceTypes, 'title')
    },
    ...mapState('mri', ['sequenceTypes'])
  },
  methods: {
    closeDialog() {
      if (this.existingScan && this.editable) this.editable = false
      this.$emit('close-scan-dialog')
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
      } else {
        this.scan = Object.assign({}, cleanScan)
        this.editable = true
      }
    },
    ...mapActions('mri', ['createScan', 'updateScan', 'deleteScan']),
    verifyDelete() {
      this.deleteWanted = true
    }
  },
  watch: {
    editable: function(isEditable) {
      if (!isEditable) {
        this.scan = Object.assign({}, this.existingScan)
      }
    }
  }
}

const cleanScan = {
  institutionName: '',
  description: '',
  sequenceType: {},
  number: null,
  comments: null,
  subject: null
}
</script>

<style lang="scss" scoped>
>>> label {
  margin-bottom: 0rem;
}
</style>
