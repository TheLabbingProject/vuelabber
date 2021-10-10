<template>
  <v-col>
    <study-table-controls
      ref="controls"
      :loading="loading"
      :options="options"
      @fetch-studies-start="loading = true"
      @fetch-studies-end="loading = false"
      @fetch-study-aggregations-start="loading = true"
      @fetch-study-aggregations-end="loading = false"
    />
    <v-data-table
      item-key="id"
      show-expand
      single-expand
      multi-sort
      :expanded.sync="expanded"
      :headers="headers"
      :items="studies"
      :loading="loading"
      :options.sync="options"
      :server-items-length="studyCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <!-- Date -->
      <template v-slot:[`item.date`]="{ item }">{{
        item.date ? item.date : '' | formatDate
      }}</template>

      <template v-slot:[`item.time`]="{ item }">{{
        item.time ? item.time.slice(0, 8) : ''
      }}</template>

      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length">
          <patient-table :studyId="item.id"></patient-table>
          <hr />
        </td>
      </template>
    </v-data-table>
  </v-col>
</template>

<script>
import PatientTable from '@/components/dicom/patient-table.vue'
import StudyTableControls from '@/components/dicom/study-table-controls.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StudyTable',
  components: { PatientTable, StudyTableControls },
  data: () => ({
    expanded: [],
    headers: [
      { text: 'Description', value: 'description', align: 'left' },
      { text: 'Date', value: 'date', align: 'center', width: 100 },
      { text: 'Time', value: 'time', align: 'center', width: 100 },
      {
        text: '# Series',
        value: 'nSeries',
        align: 'center',
        width: 120
      },
      {
        text: '# Images',
        value: 'nImages',
        align: 'center',
        width: 120
      }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['date', 'time'],
      sortDesc: [true, true]
    },
    itemsPerPageOptions: [10, 25, 50, -1],
    loading: false
  }),
  computed: {
    ...mapState('dicom', ['studies', 'studyCount'])
  },
  methods: {
    selectStudy(props) {
      props.expanded = !props.expanded
      props.expanded
        ? this.setSelectedStudyId(props.item.id)
        : this.setSelectedStudyId(null)
    },
    ...mapMutations('dicom', ['setSelectedStudyId'])
  }
}
</script>

<style scoped>
>>> tr.selected {
  background-color: #ffebee;
}
div.embeded-table {
  background-color: #e3f2fd;
}
</style>
