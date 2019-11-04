<template>
  <v-col>
    <v-row class="align-center">
      <!-- Study selection with creation dialog -->
      <v-col>
        <v-combobox
          clearable
          v-model="selectedStudy"
          append-outer-icon="add_circle"
          label="Select study"
          item-text="title"
          item-value="id"
          :items="studies"
          @click:append-outer.stop="createStudyDialog = true"
        />
        <v-dialog
          v-model="createStudyDialog"
          width="600px"
          :key="createStudyDialog"
        >
          <study-info-card
            @close-study-dialog="createStudyDialog = false"
            @created-study="selectedStudy = arguments[0]"
          />
        </v-dialog>
      </v-col>

      <!-- Group selection with creation dialog -->
      <v-col>
        <v-combobox
          clearable
          v-model="selectedGroup"
          append-outer-icon="add_circle"
          label="Select group"
          item-text="title"
          item-value="id"
          :disabled="!selectedStudy"
          :items="studyGroups"
          @click:append-outer.stop="createGroupDialog = true"
        />
        <v-dialog
          v-model="createGroupDialog"
          width="600px"
          :key="createGroupDialog"
        >
          <create-group-card
            :study="selectedStudy"
            @close-group-dialog="createGroupDialog = false"
            @created-group="selectedGroup = arguments[0]"
            @selected-study="selectedStudy = arguments[0]"
          />
        </v-dialog>
      </v-col>

      <!-- Select button -->
      <v-col cols="2">
        <v-btn @click="addSelection" :disabled="!validStudyGroupSelection">
          Select Group
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="align-top">
      <!-- Show each selected group as a chip -->
      <v-col>
        <div class="text-left pb-1">
          Selected Groups:
        </div>
        <v-row>
          <div v-for="group in selectedGroups" :key="group.id" class="pa-1">
            <v-chip
              close
              v-model="selectionChips[group.id]"
              @click:close="removeSelection(group)"
            >
              {{ `${group.study.title} | ${group.title}` }}
            </v-chip>
          </div>
        </v-row>
      </v-col>

      <!-- Associate selected groups with selected data -->
      <v-col cols="2">
        <v-btn
          @click="associateSelectedScansToStudyGroups"
          color="success"
          :disabled="!readyToAssociate"
        >
          Associate
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import StudyInfoCard from '@/components/research/study-info-card.vue'
import CreateGroupCard from '@/components/research/create-group-card.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'GroupAssociation',
  props: {
    selectedScans: Array
  },
  components: { StudyInfoCard, CreateGroupCard },
  created() {
    this.fetchStudies()
    this.fetchGroups({ filters: {}, options: {} })
  },
  data: () => ({
    createStudyDialog: false,
    createGroupDialog: false,
    selectedStudy: undefined,
    selectedGroup: undefined,
    selectedGroups: [],
    selectionChips: {}
  }),
  computed: {
    validStudyGroupSelection: function() {
      let notAlreadySelected =
        this.selectedGroups.indexOf(this.selectedGroup) == -1
      return this.selectedGroup && notAlreadySelected
    },
    readyToAssociate: function() {
      return this.selectedGroups.length && this.selectedScans.length
    },
    studyGroups: function() {
      return this.getStudyGroups(this.selectedStudy)
    },
    ...mapState('research', ['studies', 'groups'])
  },
  watch: {
    selectedStudy: function() {
      this.selectedGroup = undefined
    }
  },
  methods: {
    getStudyGroups: function(study) {
      return study
        ? this.groups.filter(group => group.study.id === study.id)
        : []
    },
    getSelectionString: function() {
      return `${this.selectedStudy.title} | ${this.selectedGroup.title}`
    },
    addSelection: function() {
      this.selectionChips[this.selectedGroup.id] = true
      this.selectedGroups.push(this.selectedGroup)
    },
    removeSelection: function(removedGroup) {
      delete this.selectionChips[removedGroup.id]
      this.selectedGroups = this.selectedGroups.filter(
        group => group.id != removedGroup.id
      )
    },
    getStudyTitle: function(studyUrl) {
      return this.studies.find(study => study.url === studyUrl).title
    },
    associateSelectedScansToStudyGroups() {
      this.selectedScans.forEach(scan => {
        this.selectedGroups
          .map(group => group.url)
          .forEach(url => {
            if (!arrayContains(url, scan.studyGroups)) {
              scan.studyGroups.push(url)
            }
          })
        this.updateScan(scan)
      })
    },
    ...mapActions('mri', ['updateScan']),
    ...mapActions('research', ['fetchStudies', 'fetchGroups'])
  }
}

function arrayContains(needle, arrhaystack) {
  return arrhaystack.indexOf(needle) > -1
}
</script>

<style scoped></style>
