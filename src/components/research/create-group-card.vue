<template>
  <v-card>
    <v-card-title class="headline cyan darken-3 white--text"
      >Create New Group</v-card-title
    >

    <v-card-text>
      <v-col>
        <v-form @submit.prevent="submit">
          <v-text-field v-model="group.title" label="Title" :counter="255" />
          <v-textarea v-model="group.description" label="Description" />
          <v-combobox
            v-model="selectedStudy"
            label="Study"
            item-text="title"
            item-value="id"
            :items="studies"
          />
        </v-form>
      </v-col>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="success" text @click="createNewGroup">Submit</v-btn>
      <v-btn color="error" text @click="$emit('close-group-dialog')"
        >Cancel</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'CreateGroupCard',
  props: { study: Object },
  created() {
    this.fetchStudies()
    if (this.study) {
      this.selectedStudy = this.study
    }
  },
  data: () => ({
    selectedStudy: undefined,
    group: Object.assign({}, cleanGroup)
  }),
  computed: {
    ...mapState('research', ['studies', 'groups']),
    ...mapGetters('research', ['getGroupByUrl'])
  },
  methods: {
    closeDialog: function() {
      this.group = Object.assign({}, cleanGroup)
      this.$emit('close-group-dialog')
    },
    createNewGroup: function() {
      this.group.study = this.selectedStudy.url
      this.createGroup(this.group)
        .then(({ url }) => this.getGroupByUrl(url))
        .then(group => this.$emit('created-group', group))
        .then(() => this.closeDialog())
    },
    ...mapActions('research', ['createGroup', 'fetchStudies', 'fetchGroups'])
  },
  watch: {
    selectedStudy: function(newValue) {
      this.$emit('selected-study', newValue)
    }
  }
}

const cleanGroup = {
  title: '',
  description: '',
  study: ''
}
</script>

<style scoped></style>
