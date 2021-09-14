<template>
  <v-container>
    <v-col>
      <v-row>
        Export Destinations
      </v-row>
      <v-row>
        <v-data-table
          dense
          item-key="id"
          :headers="headers"
          :items="exportDestinations"
          :loading="loading"
          :options.sync="options"
          :server-items-length="exportDestinationCount"
          :footer-props="{
            itemsPerPageOptions
          }"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <export-destination-table-controls
                :options="options"
                :user="user"
                @fetch-export-destinations-start="loading = true"
                @fetch-export-destinations-end="loading = false"
                ref="controls"
              />
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    small
                  >
                    {{ newItemButtonText }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="editedItem.title"
                            label="Title"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="editedItem.description"
                            label="Description"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="editedItem.ip"
                            label="IP"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="editedItem.username"
                            label="Username"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="editedItem.password"
                            label="Password"
                            type="password"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="editedItem.destination"
                            label="Destination"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <!-- User Access -->
                          <v-combobox
                            label="Share with..."
                            v-model="selectedUsers"
                            chips
                            multiple
                            :items="possibleUsers"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteExportDestination(editedItem)"
                    >
                      OK
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <!-- Title -->
          <template v-slot:[`item.title`]="{ item }">
            {{ item.title }}
          </template>

          <!-- Description -->
          <template v-slot:[`item.description`]="{ item }">
            {{ item.description }}
          </template>

          <!-- IP -->
          <template v-slot:[`item.ip`]="{ item }">
            {{ item.ip }}
          </template>

          <!-- Username -->
          <template v-slot:[`item.username`]="{ item }">
            {{ item.username }}
          </template>

          <!-- Destination -->
          <template v-slot:[`item.destination`]="{ item }">
            {{ item.destination }}
          </template>

          <!-- Status -->
          <template v-slot:[`item.status`]="{ item }">
            <v-icon small :color="itemStatusColor(item)">
              circle
            </v-icon>
          </template>

          <!-- Actions -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import ExportDestinationTableControls from '@/components/accounts/export-destination-table-controls.vue'
import { mapActions, mapState } from 'vuex'

const EMPTY_EXPORT_DESTINATION = {
  title: '',
  description: '',
  ip: '',
  username: '',
  password: '',
  destination: '',
  userIds: []
}

export default {
  name: 'ExportDestinationTable',
  mounted() {
    if (this.editPermissions) {
      this.headers.push(this.actionsHeader)
      this.defaultItem.userIds.push(this.currentUser.id)
      this.fetchUsers({ filters: {}, options: {} })
    }
  },
  components: {
    ExportDestinationTableControls
  },
  props: ['user'],
  data: () => ({
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'IP', value: 'ip' },
      { text: 'Username', value: 'username' },
      { text: 'Destination', value: 'destination' },
      { text: 'Status', value: 'status', sortable: false, align: 'center' }
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
    userDialog: false,
    chosenIndex: -1,
    dialog: false,
    dialogDelete: false,
    actionsHeader: { text: 'Actions', value: 'actions', sortable: false },
    editedIndex: -1,
    editedItem: Object.assign({}, EMPTY_EXPORT_DESTINATION),
    defaultItem: Object.assign({}, EMPTY_EXPORT_DESTINATION),
    newItemButtonText: 'New Destination',
    newItemFormTitle: 'New Export Destination',
    editItemFormTitle: 'Edit Export Destination',
    reachableExportDestinationColor: 'green',
    unreachableExportDestinationColor: 'red',
    selectedUsers: []
  }),
  computed: {
    editPermissions: function() {
      if (this.user && this.currentUser) {
        let isCurrentUser = this.currentUser.id === this.user.id
        return isCurrentUser || this.currentUser.isStaff
      }
      return false
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.newItemFormTitle
        : this.editItemFormTitle
    },
    possibleUsers: function() {
      return this.users.map(user => ({
        text: this.getUserRepresentation(user),
        value: user.id
      }))
    },
    ...mapState('accounts', [
      'exportDestinations',
      'exportDestinationCount',
      'users'
    ]),
    ...mapState('auth', { currentUser: 'user' })
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },
  methods: {
    getUserRepresentation: user =>
      `${user.firstName} ${user.lastName} [${user.username}]`,
    itemStatusColor(item) {
      return item.status
        ? this.reachableExportDestinationColor
        : this.unreachableExportDestinationColor
    },
    editItem(item) {
      this.editedIndex = this.exportDestinations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.selectedUsers = this.editedItem.users.map(user => ({
        text: this.getUserRepresentation(user),
        value: this.user.id
      }))
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.exportDestinations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      this.editedItem.userIds = this.selectedUsers.map(user => user.value)
      if (this.editedIndex > -1) {
        this.patchExportDestination(this.editedItem)
      } else {
        this.createExportDestination(this.editedItem)
      }
      this.close()
    },
    ...mapActions('accounts', [
      'createExportDestination',
      'deleteExportDestination',
      'patchExportDestination',
      'fetchUsers'
    ])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.user-info {
  background-color: #dfe9fd;
}
</style>
