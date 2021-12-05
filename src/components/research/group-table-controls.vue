<template>
  <v-container>
    <v-row class="px-4 align-left" v-if="showControls">
      <v-col :cols="2">
        <v-text-field label="Title" v-model="filters.title" />
      </v-col>
      <v-col>
        <v-text-field label="Description" v-model="filters.description" />
      </v-col>
      <div class="pa-4">
        <v-dialog
          v-model="groupCreationDialog"
          width="600px"
          v-if="user.isStaff"
        >
          <template v-slot:activator="{ on }">
            <v-btn class="info" v-on="on">
              Add
            </v-btn>
          </template>
          <create-group-card
            @close-group-dialog="groupCreationDialog = false"
            @created-group="update"
            :study="study"
          />
        </v-dialog>
      </div>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import CreateGroupCard from '@/components/research/create-group-card.vue'

export default {
  name: 'GroupTableControls',
  components: { CreateGroupCard },
  props: {
    options: Object,
    study: { type: Object, default: undefined },
    showControls: { type: Boolean, default: true }
  },
  created() {
    if (this.study) {
      this.filters.study.push(this.study.id)
    }
    this.update()
  },
  data: () => ({
    filters: {
      id: '',
      title: '',
      description: '',
      study: []
    },
    groupCreationDialog: false
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    ...mapState('auth', ['user'])
  },
  methods: {
    update() {
      this.$emit('fetch-groups-start')
      this.fetchGroups(this.query).then(() => {
        this.$emit('fetch-groups-end')
      })
    },
    ...mapActions('research', ['fetchGroups'])
  },
  watch: {
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
