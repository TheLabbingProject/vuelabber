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

      <!-- Subject ID button opening subject info dialog -->
      <template v-slot:item.subject="{ item }">
        <div class="py-1">
          <v-dialog v-model="editSubjectDialog[item.subject.id]" width="600px">
            <template v-slot:activator="{ on }">
              <v-btn small color="info" v-on="on">
                {{ item.subject.idNumber }}
              </v-btn>
            </template>
            <subject-info-card
              :subjectId="item.subject.id"
              @close-subject-dialog="editSubjectDialog[item.subject.id] = false"
            />
          </v-dialog>
        </div>
      </template>

      <!-- Date and time -->
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.time) }}
      </template>
      <template v-slot:item.time="{ item }">
        {{ formatTime(item.time) }}
      </template>

      <!-- Comments -->
      <template v-slot:item.comments="{ item }">
        <v-edit-dialog
          :return-value.sync="item.comments"
          large
          persistent
          @save="saveComments(item)"
        >
          <div>{{ item.comments }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.comments"
              label="Edit"
              single-line
              counter
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Show scan table when expanded -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="subject-data pa-0 ma-0">
          <scan-table :subject="item.subject" :session="item" />
          <hr />
        </td>
      </template>
    </v-data-table>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ScanTable from '@/components/mri/scan-table.vue'
import SessionTableControls from '@/components/mri/session-table-controls.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SessionTable',
  props: ['subject', 'bus'],
  components: {
    ScanTable,
    SessionTableControls,
    SubjectInfoCard
  },
  mounted() {
    if (this.subject) {
      this.headers.splice(1, 1)
    }
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
    editSubjectDialog: {},
    snack: false,
    snackColor: '',
    snackText: ''
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
    },
    saveComments(session) {
      let data = { sessionId: session.id, comments: session.comments }
      this.patchSession(data).then(response => {
        if (!response) {
          this.snack = true
          this.snackColor = 'error'
          this.snackText = `Failed to update session #${session.id}!`
        } else {
          this.snack = true
          this.snackColor = 'success'
          this.snackText = `Session #${session.id} successfully updated!`
        }
      })
    },
    ...mapActions('mri', ['patchSession'])
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
