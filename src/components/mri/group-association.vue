<template>
  <v-layout column>
    <v-layout row pl-3>
      <!-- Study selection with creation dialog -->
      <v-flex pr-5>
        <v-combobox
          v-model="selectedStudyTitle"
          append-outer-icon="add_circle"
          label="Select study"
          :items="studies.map(item => item.title)"
          @click:append-outer.stop="createStudyDialog = true"
        />
        <v-dialog v-model="createStudyDialog" width="600px" lazy persistent>
          <create-study-card
            @close-study-dialog="createStudyDialog = false"
            @select-study="selectedStudyTitle = arguments[0]"
          />
        </v-dialog>
      </v-flex>

      <!-- Group selection with creation dialog -->
      <v-flex pr-5>
        <v-combobox
          v-model="selectedGroupTitle"
          append-outer-icon="add_circle"
          label="Select group"
          :disabled="!selectedStudy"
          :items="studyGroups.map(group => group.title)"
          @click:append-outer.stop="createGroupDialog = true"
        />
        <v-dialog v-model="createGroupDialog" width="600px" lazy persistent>
          <create-group-card
            @close-group-dialog="closeGroupDialog"
            @select-group="selectedGroupTitle = arguments[0]"
            @select-study="selectedStudyTitle = arguments[0]"
            :selectedStudy="selectedStudy"
          />
        </v-dialog>
      </v-flex>

      <!-- Select button -->
      <v-btn @click="addSelection" :disabled="!validStudyGroupSelection">
        Select Group
      </v-btn>
    </v-layout>

    <v-layout row pl-3>
      <!-- Show each selected group as a chip -->
      <v-layout column>
        <v-flex pb-1 class="text-xs-left">
          Selected Groups:
        </v-flex>
        <v-flex class="text-xs-left">
          <span v-for="selection in selectedStudyGroups" :key="selection.id">
            <v-chip
              close
              v-model="selectionChips[selection.id]"
              @input="removeSelection(selection)"
            >
              {{ `${selection.study.title} | ${selection.title}` }}
            </v-chip>
          </span>
        </v-flex>
      </v-layout>

      <!-- Associate selected groups with selected data -->
      <v-layout shrink>
        <v-btn
          @click="associateScanToStudyGroups"
          color="success"
          :disabled="!readyToAssociate"
        >
          Associate
        </v-btn>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
import CreateStudyCard from '@/components/research/create-study-card.vue'
import CreateGroupCard from '@/components/research/create-group-card.vue'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'GroupAssociation',
  props: {
    selectedScans: Array
  },
  components: { CreateStudyCard, CreateGroupCard },
  created() {
    this.$store.dispatch('research/fetchStudies')
    this.$store.dispatch('research/fetchGroups')
  },
  data: () => ({
    selectedStudyTitle: '',
    selectedGroupTitle: '',
    selectedStudyGroups: [],
    selectionChips: {},
    createStudyDialog: false,
    createGroupDialog: false
  }),
  computed: {
    selectedStudy: function() {
      // Check if the choice is valid
      let isValidChoice = arrayContains(
        this.selectedStudyTitle,
        this.studies.map(study => study.title)
      )
      // Return the selected study object
      if (isValidChoice) {
        return this.getStudyByTitle(this.selectedStudyTitle)
      } else {
        return null
      }
    },
    selectedGroup: function() {
      if (this.selectedGroupTitle != '' && this.selectedStudy != null) {
        return this.getStudyGroupByTitle({
          study: this.selectedStudy,
          groupTitle: this.selectedGroupTitle
        })
      } else {
        return null
      }
    },
    studyGroups: function() {
      if (this.selectedStudy != null) {
        return this.getStudyGroups(this.selectedStudy)
      } else {
        return []
      }
    },
    validStudyGroupSelection: function() {
      let notAlreadySelected =
        this.selectedStudyGroups.indexOf(this.selectedGroup) == -1
      return this.selectedGroup && notAlreadySelected
    },
    readyToAssociate: function() {
      return (
        this.selectedStudyGroups.length != 0 && this.selectedScans.length != 0
      )
    },
    ...mapState('research', ['studies', 'groups']),
    ...mapGetters('research', [
      'getStudyByTitle',
      'getStudyGroups',
      'getStudyGroupByTitle'
    ])
  },
  watch: {
    selectedStudy: function() {
      this.selectedGroupTitle = ''
    }
  },
  methods: {
    getSelectionString: function() {
      return `${this.selectedStudy.title} | ${this.selectedGroup.title}`
    },
    addSelection: function() {
      this.selectionChips[this.selectedGroup.id] = true
      this.selectedStudyGroups.push(this.selectedGroup)
    },
    removeSelection: function(removedGroup) {
      delete this.selectionChips[removedGroup.id]
      this.selectedStudyGroups = this.selectedStudyGroups.filter(
        group => group.id != removedGroup.id
      )
    },
    associateScanToStudyGroups() {
      this.selectedScans.forEach(scan => {
        this.selectedStudyGroups
          .map(group => group.url)
          .forEach(url => {
            if (!arrayContains(url, scan.studyGroups)) {
              scan.studyGroups.push(url)
            }
          })
        this.updateScan(scan)
      })
    },
    closeGroupDialog: function() {
      this.createGroupDialog = false
    },
    ...mapActions('mri', ['updateScan'])
  }
}

function arrayContains(needle, arrhaystack) {
  return arrhaystack.indexOf(needle) > -1
}
</script>

<style lang="scss" scoped></style>
