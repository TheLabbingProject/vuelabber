<template>
  <v-row class="px-4 justify-space-between align-center">
    <!-- Description -->
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
            <v-date-picker v-model="filters.afterDate" @input="afterDateMenu = false"></v-date-picker>
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
            <v-date-picker v-model="filters.beforeDate" @input="beforeDateMenu = false"></v-date-picker>
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
import { mapState, mapActions } from 'vuex'
import { createSelectItems } from '@/components/utils'

export default {
  name: 'SessionTableControls',
  props: { options: Object, subject: Object },
  created() {
    this.$set(this.filters, 'subject', this.subject.id)
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
    sequenceTypeItems: function() {
      let items = createSelectItems(this.sequenceTypes, 'title', 'id')
      items.push({ text: 'Undefined', value: -1 })
      return items
    },
    ...mapState('mri', ['sequenceTypes'])
  },
  methods: {
    update() {
      this.$emit('fetch-sessions-start')
      this.fetchSessions({ filters: this.filters, options: this.options })
      this.$emit('fetch-sessions-end')
    },
    ...mapActions('mri', ['fetchSessions'])
  },
  watch: {
    subject: function(selectedSubject) {
      this.$set(this.filters, 'subject', selectedSubject.id)
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
