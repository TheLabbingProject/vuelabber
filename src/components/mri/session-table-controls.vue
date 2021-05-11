<template>
  <v-row class="px-4 justify-space-between align-center">
    <!-- ID -->
    <v-col :cols="2">
      <v-text-field v-model="filters.id" label="ID" />
    </v-col>
    <!-- Scan Date -->
    <v-col :cols="4">
      <v-row class="align-center">
        <!-- After Date -->
        <v-col>
          <v-menu v-model="afterDateMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field
                clearable
                readonly
                label="Scanned After"
                prepend-icon="event"
                v-model="filters.afterDate"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filters.afterDate"
              @input="afterDateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- Before Date -->
        <v-col>
          <v-menu v-model="beforeDateMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="filters.beforeDate"
                label="Scanned Before"
                readonly
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filters.beforeDate"
              @input="beforeDateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>
    <!-- Comments -->
    <v-col :cols="2">
      <v-text-field v-model="filters.comments" label="Comments" />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SessionTableControls',
  props: ['subject', 'options'],
  mounted() {
    // eslint-disable-next-line
    // EventBus.$on('fetch-sessions', this.update)
    if (this.subject) {
      this.$set(this.filters, 'subject', this.subject.id)
    }
    this.update()
  },
  data: () => ({
    filters: {
      id: '',
      afterDate: '',
      beforeDate: '',
      comments: '',
      subject: ''
    },
    afterDateMenu: false,
    beforeDateMenu: false
  }),
  computed: {
    parsedOptions: function() {
      let options = Object.assign({}, this.options)
      options['sortBy'] = options['sortBy'].map(item => {
        if (item == 'date') {
          return 'time__date'
        } else if (item == 'time') {
          return 'time__time'
        } else {
          return item
        }
      })
      return options
    }
  },
  methods: {
    update() {
      this.$emit('fetch-sessions-start')
      let query = { filters: this.filters, options: this.parsedOptions }
      this.fetchSessions(query).then(() => {
        this.$emit('fetch-sessions-end')
      })
    },
    ...mapActions('mri', ['fetchSessions'])
  },
  watch: {
    subject(selectedSubject) {
      if (selectedSubject) {
        this.$set(this.filters, 'subject', selectedSubject.id)
      }
    },
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

<style scoped></style>
