<template>
  <v-col>
    <v-row class="align-center">
      <!-- Study selection with creation dialog -->
      <v-col>
        <v-combobox
          v-model="selectedStudyTitle"
          append-outer-icon="add_circle"
          label="Select study"
          :items="studies.map(item => item.title)"
          @click:append-outer.stop="createStudyDialog = true"
        />
        <v-dialog
          v-model="createStudyDialog"
          width="600px"
          :key="createStudyDialog"
        >
          <study-info-card @close-study-dialog="createStudyDialog = false" />
        </v-dialog>
      </v-col>

      <!-- Group selection with creation dialog -->
      <v-col>
        <v-combobox
          v-model="selectedGroupTitle"
          append-outer-icon="add_circle"
          label="Select group"
          :disabled="!selectedStudy"
          :items="selectedStudyGroups.map(group => group.title)"
          @click:append-outer.stop="createGroupDialog = true"
        />
        <v-dialog
          v-model="createGroupDialog"
          width="600px"
          :key="createGroupDialog"
        >
          <create-group-card
            @close-group-dialog="closeGroupDialog(arguments[0])"
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
        <div class="text-left">
          <span v-for="selection in selectedGroups" :key="selection.id">
            <v-chip
              close
              v-model="selectionChips[selection.id]"
              @input="removeSelection(selection)"
            >
              {{ `${selection.study.title} | ${selection.title}` }}
            </v-chip>
          </span>
        </div>
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
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'GroupAssociation',
  props: {
    selectedScans: Array
  },
  components: { StudyInfoCard, CreateGroupCard },
  created() {
    this.fetchStudies()
  },
  data: () => ({
    selectedGroupTitle: '',
    selectedGroups: [],
    selectionChips: {},
    createStudyDialog: false,
    createGroupDialog: false
  }),
  computed: {
    selectedStudyTitle: {
      get: function() {
        return this.getSelectedStudyTitle
      },
      set: function(title) {
        this.setSelectedStudyByTitle(title)
        this.fetchSelectedStudyGroups()
      }
    },
    selectedGroup: function() {
      return this.getSelectedStudyGroupByTitle(this.selectedGroupTitle)
    },
    validStudyGroupSelection: function() {
      let notAlreadySelected =
        this.selectedGroups.indexOf(this.selectedGroup) == -1
      return this.selectedGroup && notAlreadySelected
    },
    readyToAssociate: function() {
      return this.selectedGroups.length && this.selectedScans.length
    },
    ...mapState('research', [
      'studies',
      'selectedStudy',
      'selectedStudyGroups'
    ]),
    ...mapGetters('research', [
      'getStudyByTitle',
      'getStudyGroups',
      'getSelectedStudyGroupByTitle',
      'getSelectedStudyTitle'
    ])
  },
  watch: {
    selectedStudy: function() {
      // Clear group selection when changing study selection
      this.selectedGroupTitle = ''
    }
  },
  methods: {
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
    closeGroupDialog: function(newGroupTitle) {
      if (newGroupTitle) {
        this.fetchSelectedStudyGroups().then(
          () => (this.selectedGroupTitle = newGroupTitle)
        )
      }
      this.createGroupDialog = false
    },
    ...mapActions('mri', ['updateScan']),
    ...mapActions('research', ['fetchStudies', 'fetchSelectedStudyGroups']),
    ...mapMutations('research', ['setSelectedStudyByTitle'])
  }
}

function arrayContains(needle, arrhaystack) {
  return arrhaystack.indexOf(needle) > -1
}
</script>

<style scoped></style>
