<template>
  <div>
    <v-data-table
      dense
      item-key="id"
      show-expand
      single-expand
      multi-sort
      :expanded.sync="expanded"
      :headers="headers"
      :items="sessions"
      :loading="loading"
      :options.sync="options"
      :server-items-length="sessionCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <session-table-controls
          ref="controls"
          :bus="bus"
          :subject="subject"
          :options="options"
          @fetch-sessions-start="loading = true"
          @fetch-sessions-end="loading = false"
        />
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.time) }}
      </template>
      <template v-slot:item.time="{ item }">
        {{ formatTime(item.time) }}
      </template>

      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="subject-data pa-0 ma-0">
          <scan-table :subject="subject" :session="item" />
          <hr />
        </td>
      </template>
      <template v-slot:item.subject="{ item }">
        <div class="py-1">
          <v-dialog v-model="editSubjectDialog[item.id]" width="600px">
            <template v-slot:activator="{ on }">
              <v-btn small color="info" v-on="on">
                {{ item.subject.idNumber }}
              </v-btn>
            </template>
            <subject-info-card :subjectId="item.subject.id" />
          </v-dialog>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ScanTable from '@/components/mri/scan-table.vue'
import SessionTableControls from '@/components/mri/session-table-controls.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapState } from 'vuex'

export default {
  name: 'SessionTable',
  props: ['subject', 'bus'],
  components: {
    ScanTable,
    SessionTableControls,
    SubjectInfoCard
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left', width: 1 },
      { text: 'Subject', value: 'subject', align: 'center' },
      { text: 'Date', value: 'date' },
      { text: 'Time', value: 'time' },
      { text: 'Comments', value: 'comments' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['date', 'time'],
      sortDesc: [true, true]
    },
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false,
    expanded: [],
    editSubjectDialog: []
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
      let time = sessionTime.slice(11, 23)
      return time
    }
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
