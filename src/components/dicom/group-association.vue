<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex pr-5>
        <v-combobox
          v-model="selectedStudyTitle"
          append-outer-icon="add_circle"
          label="Select study"
          :items="studies.map(item => item.title)"
          @click:append-outer.stop="createStudyDialog = true"
        />
        <v-layout row justify-center>
          <v-dialog v-model="createStudyDialog" width="600px" lazy persistent>
            <create-study @close-dialog="createStudyDialog = false" />
          </v-dialog>
        </v-layout>
      </v-flex>
      <v-flex pr-5>
        <v-combobox
          v-model="selectedGroupTitle"
          append-outer-icon="add_circle"
          label="Select group"
          :disabled="!selectedStudy"
          :items="studyGroups.map(group => group.title)"
        />
      </v-flex>
      <v-btn @click="addSelection" :disabled="!selectedGroup">
        Select Group
      </v-btn>
    </v-layout>
    <v-layout wrap>
      <v-flex fill-height class="text-xs-left">
        Selected Groups:
        <v-chip v-for="selection in selections" :key="selection.id">
          {{ `${selection.study.title} | ${selection.title}` }}
        </v-chip>
      </v-flex>
      <v-btn
        @click="associateSeriesToStudyGroups"
        color="success"
        :disabled="selections.length == 0"
      >
        Associate
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import CreateStudy from '@/components/research/create-study.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'GroupAssociation',
  props: {
    selectedSeries: Array
  },
  components: { CreateStudy },
  created() {
    this.$store.dispatch('research/fetchStudies')
    this.$store.dispatch('research/fetchGroups')
  },
  data: () => ({
    selectedStudyTitle: '',
    selectedStudy: null,
    selectedGroupTitle: '',
    selectedGroup: null,
    selections: [],
    studyGroups: [],
    createStudyDialog: false
  }),
  computed: {
    ...mapState('research', ['studies', 'groups']),
    ...mapGetters('research', [
      'getStudyByTitle',
      'getStudyGroups',
      'getStudyGroupByTitle'
    ])
  },
  watch: {
    selectedStudyTitle: function(title) {
      if (title) {
        this.selectedStudy = this.getStudyByTitle(title)
      } else {
        this.selectedStudy = null
      }
    },
    selectedStudy: function(study) {
      if (study) {
        this.studyGroups = this.getStudyGroups(study)
      } else {
        this.studyGroups = []
        this.selectedGroup = null
      }
    },
    selectedGroupTitle: function(groupTitle) {
      if (groupTitle) {
        this.selectedGroup = this.getStudyGroupByTitle({
          study: this.selectedStudy,
          groupTitle
        })
      } else {
        this.selectedGroup = null
      }
    }
  },
  methods: {
    getSelectionString: function() {
      return `${this.selectedStudy.title} | ${this.selectedGroup.title}`
    },
    addSelection: function() {
      this.selections.push(this.selectedGroup)
    },
    associateSeriesToStudyGroups() {
      this.selectedSeries.forEach(series => console.log(series.id))
    }
  }
}
</script>

<style lang="scss" scoped></style>
