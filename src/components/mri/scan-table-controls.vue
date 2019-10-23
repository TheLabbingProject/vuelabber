<template>
  <v-layout row px-4>
    <v-text-field v-model="filters.number" label="Number" />
    <v-spacer />
    <v-text-field v-model="filters.description" label="Description" />
    <v-spacer />
    <v-flex>
      <v-menu
        v-model="afterDateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="filters.afterDate"
            label="Scanned After"
            readonly
            clearable
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="filters.afterDate"
          @input="afterDateMenu = false"
        ></v-date-picker>
      </v-menu>
    </v-flex>
    <v-spacer />
    <v-flex>
      <v-menu
        v-model="beforeDateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
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
    </v-flex>
    <v-spacer />
    <v-combobox
      v-model="filters.sequenceType"
      label="Sequence Type"
      :items="sequenceTypeItems"
    />
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { createSelectItems } from '@/components/utils'

export default {
  name: 'ScanTableControls',
  props: { pagination: Object },
  created() {
    this.$set(this.filters, 'subject', this.subject.id)
  },
  data: () => ({
    filters: {
      number: '',
      description: '',
      afterDate: '',
      beforeDate: '',
      sequenceType: '',
      dicomId: '',
      subject: ''
    },
    afterDateMenu: false,
    beforeDateMenu: false
  }),
  computed: {
    sequenceTypeItems: function() {
      return createSelectItems(this.sequenceTypes, 'title', 'id')
    },
    ...mapState('mri', ['sequenceTypes']),
    ...mapGetters('research', { subject: 'getSelectedSubject' })
  },
  methods: {
    update() {
      this.$emit('fetch-scans-start')
      this.fetchScans({ filters: this.filters, pagination: this.pagination })
      this.$emit('fetch-scans-end')
    },
    ...mapActions('mri', ['fetchScans'])
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
    pagination: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
