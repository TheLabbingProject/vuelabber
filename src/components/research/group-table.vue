<template>
  <div>
    <v-data-table
      dense
      item-key="id"
      :headers="headers"
      :items="groups"
      :loading="loading"
      :options.sync="options"
      :server-items-length="groupCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <group-table-controls
          ref="controls"
          :options="options"
          :study="study"
          :showControls="showControls"
          @fetch-groups-start="loading = true"
          @fetch-groups-end="loading = false"
        />
      </template>

      <template v-slot:item.delete="{ item }" v-if="user.isStaff">
        <v-btn small text @click="deleteGroup(item)">
          <v-icon>
            delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import GroupTableControls from '@/components/research/group-table-controls.vue'

export default {
  name: 'GroupTable',
  components: { GroupTableControls },
  props: { study: Object, showControls: { type: Boolean, default: true } },
  mounted() {
    if (!this.study) {
      this.headers.splice(1, 0, this.studyHeader)
    }
    if (this.user.isStaff) {
      this.headers.push(this.deleteHeader)
    }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'center', width: 80 },
      { text: 'Title', value: 'title', align: 'left', width: 270 },
      { text: 'Description', value: 'description', align: 'left' }
    ],
    studyHeader: { text: 'Study', value: 'study.title', align: 'left' },
    deleteHeader: {
      text: 'Delete',
      value: 'delete',
      align: 'center',
      sortable: false,
      width: 1
    },
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['latestMriSessionTime'],
      sortDesc: [true]
    },
    itemsPerPageOptions: [10, 25, 50, 100],
    loading: false
  }),
  computed: {
    ...mapState('research', ['groups', 'groupCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('research', ['deleteGroup'])
  }
}
</script>
<style></style>
