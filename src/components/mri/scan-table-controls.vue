<template>
  <v-container fluid>
    <!-- Subject Information -->
    <v-row v-if="!subject" class="pt-1">
      <!-- Subject ID Number -->
      <v-col>
        <v-text-field
          autofocus
          clearable
          v-model="filters.subjectIdNumber"
          label="Subject ID"
        />
      </v-col>
      <!-- Subject First Name -->
      <v-col>
        <v-text-field
          clearable
          v-model="filters.subjectFirstName"
          label="First Name"
        />
      </v-col>
      <!-- Subject Last Name -->
      <v-col>
        <v-text-field
          clearable
          v-model="filters.subjectLastName"
          label="Last Name"
        />
      </v-col>
    </v-row>

    <!-- Scan Information -->
    <v-row>
      <!-- Number -->
      <v-col class="pt-0">
        <v-text-field clearable v-model="filters.number" label="Scan Number" />
      </v-col>

      <!-- Description -->
      <v-col class="pt-0">
        <v-text-field
          clearable
          v-model="filters.description"
          label="Scan Description"
        />
      </v-col>
      <!-- Date -->
      <v-col class="pt-0" :cols="4">
        <v-row class="align-center">
          <!-- After Date -->
          <v-col>
            <v-menu v-model="afterDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable
                  readonly
                  label="Scanned After"
                  prepend-icon="event"
                  v-model="filters.afterDate"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.afterDate"
                @input="afterDateMenu = false"
              ></v-date-picker>
            </v-menu> </v-col
          >-
          <!-- Before Date -->
          <v-col>
            <v-menu v-model="beforeDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="filters.beforeDate"
                  label="Scanned Before"
                  readonly
                  clearable
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.beforeDate"
                @input="beforeDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="pt-0">
        <v-select
          v-model="filters.studyGroups"
          label="Study Group"
          chips
          small-chips
          clearable
          multiple
          deletable-chips
          item-value="id"
          :items="computedGroups"
          :loading="loadingStudyGroups"
          :menu-props="menuProps"
        ></v-select>
      </v-col>

      <!-- Sequence Type -->
      <v-col class="pt-0">
        <v-select
          chips
          small-chips
          clearable
          multiple
          deletable-chips
          label="Sequence Type"
          v-model="filters.sequenceType"
          :items="sequenceTypeItems"
          :menu-props="menuProps"
        />
      </v-col>

      <!-- Download -->
      <v-col class="pt-0 px-0">
        <v-container flex>
          <span class="px-1">
            <v-btn
              small
              rounded
              color="indigo lighten-3"
              :disabled="!selectedScans.length"
              :href="dicomDownloadUrl"
            >
              DICOM
            </v-btn>
          </span>
          <span class="px-1">
            <v-btn
              small
              rounded
              color="indigo lighten-3"
              :disabled="!selectedScans.length"
              :href="niftiDownloadUrl"
            >
              NIfTI
            </v-btn>
          </span>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { SCANS } from '@/api/mri/endpoints.js'
import { SERIES } from '@/api/dicom/endpoints.js'
import { SEQUENCE_TYPE_ITEMS } from '@/components/utils.js'

export default {
  name: 'ScanTableControls',
  props: {
    options: Object,
    subject: Object,
    session: Object,
    selectedScans: Array
  },
  created() {
    if (this.subject) {
      this.$set(this.filters, 'subject', this.subject.id)
    }
    if (this.session) {
      this.$set(this.filters, 'session', this.session.id)
    }
  },
  mounted() {
    // eslint-disable-next-line
    EventBus.$on('fetch-scans', this.update)
    this.update()
  },
  data: () => ({
    filters: {
      number: '',
      description: '',
      afterDate: '',
      beforeDate: '',
      sequenceType: '',
      dicomId: '',
      session: '',
      subjectIdNumber: '',
      subjectFirstName: '',
      subjectLastName: '',
      studyGroups: []
    },
    afterDateMenu: false,
    beforeDateMenu: false,
    sequenceTypeItems: SEQUENCE_TYPE_ITEMS,
    loadingStudyGroups: false,
    studyGroupQuery: { filters: {}, options: {} },
    menuProps: { offsetY: true, auto: true }
  }),
  computed: {
    parsedOptions: function() {
      let options = Object.assign({}, this.options)
      options['sortBy'] = options['sortBy'].map(item => {
        if (item == 'date') {
          return 'time__date'
        } else if (item == 'time') {
          return 'time__time'
        } else if (item == 'subject.firstName') {
          return 'session__subject__first_name'
        } else if (item == 'subject.lastName') {
          return 'session__subject__last_name'
        } else if (item == 'subject.idNumber') {
          return 'session__subject__id_number'
        } else {
          return item
        }
      })
      return options
    },
    selectedIdsString: function() {
      return this.selectedScans.map(scan => scan.id).join(',')
    },
    selectedDicomIdsString: function() {
      return this.selectedScans.map(scan => scan.dicom).join(',')
    },
    niftiDownloadUrl: function() {
      return `${SCANS}/nifti_zip/${this.selectedIdsString}/`
    },
    dicomDownloadUrl: function() {
      return `${SERIES}/to_zip/${this.selectedDicomIdsString}/`
    },
    computedGroups: function() {
      return this.groups.map(group => ({
        ...group,
        text: `${group.study.title}|${group.title}`
      }))
    },
    ...mapState('mri', ['scans']),
    ...mapState('research', ['groups'])
  },
  methods: {
    update() {
      this.$emit('fetch-scans-start')
      let query = { filters: this.filters, options: this.parsedOptions }
      this.fetchScans(query).then(() => {
        this.$emit('fetch-scans-end')
      })
    },
    updateStudyGroups() {
      this.loadingStudyGroups = true
      this.fetchGroups(this.studyGroupQuery).then(() => {
        this.loadingStudyGroups = false
      })
    },
    downloadDicom() {
      return
    },
    ...mapActions('mri', ['fetchScans']),
    ...mapActions('research', ['fetchGroups'])
  },
  watch: {
    subject: function(selectedSubject) {
      this.$set(this.filters, 'subject', selectedSubject.id)
    },
    session: function(selectedSession) {
      this.$set(this.filters, 'session', selectedSession.id)
    },
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    options: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
