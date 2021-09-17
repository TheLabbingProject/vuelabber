<template>
  <v-container>
    <v-row class="px-4">
      <!-- ID -->
      <v-col :cols="1">
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
      <v-col :cols="2">
        <v-select
          v-model="filters.studyIdIn"
          label="Associated Studies"
          :items="studies"
          item-text="title"
          item-value="id"
          multiple
          clearable
        />
      </v-col>
      <!-- Comments -->
      <v-col :cols="3">
        <v-text-field v-model="filters.comments" label="Comments" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SessionTableControls',
  props: ['subject', 'options'],
  mounted() {
    if (this.subject) {
      this.$set(this.filters, 'subject', this.subject.id)
    }
    this.update()
    this.fetchStudies({ filters: {}, options: {} })
  },
  data: () => ({
    filters: {
      id: '',
      afterDate: '',
      beforeDate: '',
      comments: '',
      subject: '',
      studyIdIn: []
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
    },
    ...mapState('research', ['studies'])
  },
  methods: {
    update() {
      this.$emit('fetch-sessions-start')
      let query = { filters: this.filters, options: this.parsedOptions }
      this.fetchSessions(query).then(() => {
        this.$emit('fetch-sessions-end')
      })
    },
    ...mapActions('mri', ['fetchSessions']),
    ...mapActions('research', ['fetchStudies'])
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
