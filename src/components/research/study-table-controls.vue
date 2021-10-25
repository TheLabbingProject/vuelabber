<template>
  <v-container>
    <v-row class="px-4 align-left">
      <v-col :cols="2">
        <v-text-field
          autofocus
          v-model="titleFilter.value"
          :label="titleFilter.label"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="descriptionFilter.value"
          :label="descriptionFilter.label"
        />
      </v-col>
      <v-col :cols="2">
        <v-autocomplete
          v-model="collaboratorsFilter.value"
          clearable
          multiple
          small-chips
          :items="users"
          :label="collaboratorsFilter.label"
          :loading="loadingCollaborators"
          @update:search-input="updateCollaborators"
          item-text="username"
          item-value="pk"
        />
      </v-col>
      <v-col :cols="2">
        <v-autocomplete
          v-model="proceduresFilter.value"
          clearable
          multiple
          small-chips
          :items="procedures"
          :label="proceduresFilter.label"
          :loading="loadingProcedures"
          @update:search-input="updateProcedures"
          item-text="title"
          item-value="id"
        />
      </v-col>
    </v-row>
    <v-row v-if="studyAggregations" class="px-4 align-left">
      <v-col>
        <v-row>
          <v-range-slider
            v-model="nSubjectsRangeFilter.value"
            hide-details
            :label="nSubjectsRangeFilter.label"
            :max="studyAggregations.nSubjectsMax"
            :min="studyAggregations.nSubjectsMin"
            :disabled="loading"
            :loading="aggregationsLoading"
          >
            <template v-slot:prepend>
              <v-text-field
                :disabled="loading"
                :value="nSubjectsRangeFilter.value[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nSubjectsRangeFilter.value, 0, $event)"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :disabled="loading"
                :value="nSubjectsRangeFilter.value[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(nSubjectsRangeFilter.value, 1, $event)"
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'StudyTableControls',
  props: { loading: Boolean, options: Object },
  created() {
    this.updateStudyAggregations()
    this.update()
  },
  data: () => ({
    titleFilter: { label: 'Title', value: '' },
    descriptionFilter: { label: 'Description', value: '' },
    collaboratorsFilter: { label: 'Collaborators', value: [] },
    loadingCollaborators: false,
    proceduresFilter: { label: 'Procedures', value: [] },
    loadingProcedures: false,
    nSubjectsRangeFilter: { label: 'Number of Subjects', value: [0, 1] },
    loadingAggregations: false
  }),
  computed: {
    filters: function() {
      return {
        title: this.titleFilter.value,
        description: this.descriptionFilter.value,
        collaborators: this.collaboratorsFilter.value,
        procedures: this.proceduresFilter.value,
        nSubjectsMin: this.studyAggregations
          ? this.nSubjectsRangeFilter.value[0]
          : '',
        nSubjectsMax: this.studyAggregations
          ? this.nSubjectsRangeFilter.value[1]
          : ''
      }
    },
    ...mapState('accounts', ['users']),
    ...mapState('research', ['procedures', 'studyAggregations'])
  },
  methods: {
    update() {
      this.$emit('fetch-studies-start')
      let query = { filters: this.filters, options: this.options }
      this.fetchStudies(query).then(() => {
        this.$emit('fetch-studies-end')
      })
    },
    updateCollaborators(value) {
      this.loadingCollaborators = true
      this.fetchUsers({ filters: { username: value }, options: {} }).then(
        () => {
          this.loadingCollaborators = false
        }
      )
    },
    updateProcedures(value) {
      this.loadingProcedures = true
      let query = { filters: { title: value }, options: {} }
      this.fetchProcedures({ query }).then(() => {
        this.loadingProcedures = false
      })
    },
    updateStudyAggregations() {
      this.$emit('fetch-study-aggregations-start')
      this.aggregationsLoading = true
      this.fetchStudyAggregations().then(() => {
        if (this.studyAggregations) {
          this.nSubjectsRangeFilter.value = [
            this.studyAggregations.nSubjectsMin,
            this.studyAggregations.nSubjectsMax
          ]
        }
        this.aggregationsLoading = false
        this.$emit('fetch-study-aggregations-end')
      })
    },
    ...mapActions('research', [
      'fetchStudies',
      'fetchProcedures',
      'fetchStudyAggregations'
    ]),
    ...mapActions('accounts', ['fetchUsers'])
  },
  watch: {
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
