<template>
  <div class="pa-4">
    <v-data-table
      dense
      item-key="id"
      :headers="headers"
      :items="events"
      :loading="loading"
      :options.sync="options"
      :server-items-length="eventCount"
      show-expand
      single-expand
      :expanded.sync="expanded"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <event-table-controls
          :options="options"
          :procedure="procedure"
          :showControls="showControls"
          @fetch-events-start="loading = true"
          @fetch-events-end="loading = false"
        />
      </template>

      <!-- Title -->
      <template v-slot:item.title="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.title"
          large
          @save="saveTitle(item)"
        >
          <div>{{ item.title }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.title"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Description -->
      <template v-slot:item.description="{ item }" v-if="user.isStaff">
        <v-edit-dialog
          :return-value.sync="item.description"
          large
          @save="saveDescription(item)"
        >
          <div>{{ item.description }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.description"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EventTableControls from '@/components/research/event-table-controls.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'EventTable',
  components: { EventTableControls },
  props: { procedure: Object, showControls: Boolean },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left', width: 1 },
      { text: 'Type', value: 'type' },
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['title'],
      sortDesc: [false]
    },
    itemsPerPageOptions: [10, 20, 30],
    loading: false,
    expanded: [],
    expand: true,
    eventDialog: false,
    chosenIndex: -1
  }),
  computed: {
    ...mapState('research', ['events', 'eventCount']),
    ...mapState('auth', ['user'])
  },
  methods: {
    saveTitle(event) {
      let data = { eventId: event.id, title: event.title }
      this.updateEvent(data)
    },
    saveDescription(event) {
      let data = {
        eventId: event.id,
        description: event.description
      }
      this.updateEvent(data)
    },
    ...mapActions('research', ['updateEvent'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.event-info {
  background-color: #dfe9fd;
}
</style>
