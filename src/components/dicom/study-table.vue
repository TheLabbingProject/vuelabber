<template>
  <v-col>
    <study-table-controls
      ref="tableController"
      :options="options"
      @fetch-studies-start="loading = true"
      @fetch-studies-end="loading = false"
    />
    <v-data-table
      item-key="id"
      show-expand
      single-expand
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
      <template v-slot:item.date="{ item }">{{ item.date | formatDate }}</template>

      <template v-slot:item.time="{ item }">{{ item.time.slice(0, 8) }}</template>

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
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'Description', value: 'description' },
      { text: 'Date', value: 'date' },
      { text: 'Time', value: 'time' },
      { text: 'UID', value: 'uid' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['id'],
      descending: true
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
