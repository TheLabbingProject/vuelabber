<template>
  <div>
    <v-data-table
      dense
      item-key="id"
      show-expand
      single-expand
      :expanded.sync="expanded"
      :headers="headers"
      :items="sessions"
      :loading="loading"
      :options.sync="options"
      :server-items-length="subjectCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <session-table-controls
          :options="options"
          @fetch-sessions-start="loading = true"
          @fetch-sessions-end="loading = false"
        />
      </template>
      <template v-slot:item.date="{ item }">
        {{
        item.date | formatDate
        }}
      </template>
      <template v-slot:item.time="{ item }">
        {{
        item.time | formatTime
        }}
      </template>

      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="subject-data pa-0 ma-0">
          <scan-table :subject="item" />
          <hr />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ScanTable from '@/components/mri/scan-table.vue'
import SessionTableControls from '@/components/mri/session-table-controls.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SessionTable',
  components: {
    ScanTable,
    SessionTableControls
  },
  created() {
    // Add edit column for staff users
    this.fetchUsers({ filters: {}, pagination: {} }).then(() =>
      this.appendEditColumn()
    )
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'Date', value: 'date' },
      { text: 'Time', value: 'time' },
      { text: 'Comments', value: 'comments' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['id'],
      descending: true
    },
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false,
    expanded: []
  }),
  computed: {
    ...mapState('mri', ['sessions', 'sessionCount']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    formatDate(sessionTime) {
      if (!sessionTime) return null
      let [year, month, day] = sessionTime.slice(0, 10).split('-')
      return `${day}/${month}/${year}`
    },
    formatTime(sessionTime) {
      if (!sessionTime) return null
      return sessionTime.slice(11, 23)
    },
    ...mapActions('accounts', ['fetchUsers'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.subject-data {
  background-color: #dfe9fd;
}
</style>
