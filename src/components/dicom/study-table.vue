<template>
  <v-layout column>
    <study-table-controls
      ref="tableController"
      :pagination="pagination"
      @fetch-studies-start="loading = true"
      @fetch-studies-end="loading = false"
    />
    <v-data-table
      item-key="id"
      :expand="expand"
      :headers="headers"
      :items="studies"
      :loading="loading"
      :pagination.sync="pagination"
      :rows-per-page-items="pagination.rowsPerPageItems"
      :total-items="studyCount"
    >
      <template v-slot:items="props">
        <!-- Study Table Row -->
        <tr
          @click="selectStudy(props)"
          :class="{ selected: props.item.id === selectedStudyId }"
        >
          <!-- ID -->
          <td class="text-xs-left" style="width: 50px;">
            {{ props.item.id }}
          </td>

          <!-- Description -->
          <td class="text-xs-left">
            {{ props.item.description }}
          </td>

          <!-- Date -->
          <td class="text-xs-left">
            {{ props.item.date | formatDate }}
          </td>

          <!-- Time -->
          <td class="text-xs-left">
            {{ props.item.time }}
          </td>

          <!-- UID -->
          <td class="text-xs-left">
            {{ props.item.uid }}
          </td>
        </tr>
      </template>
      <template v-slot:expand="props">
        <v-flex class="embeded-table" px-2 py-2>
          <patient-table :studyId="selectedStudyId"></patient-table>
          <hr />
        </v-flex>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import PatientTable from '@/components/dicom/patient-table.vue'
import StudyTableControls from '@/components/dicom/study-table-controls.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StudyTable',
  components: { PatientTable, StudyTableControls },
  data: () => ({
    expand: false,
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'Description', value: 'description' },
      { text: 'Date', value: 'date' },
      { text: 'Time', value: 'time' },
      { text: 'UID', value: 'uid' }
    ],
    pagination: {
      rowsPerPage: 25,
      page: 1,
      sortBy: 'id',
      descending: false,
      rowsPerPageItems: [
        10,
        25,
        50,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: 100000 }
      ]
    },
    loading: false
  }),
  computed: {
    ...mapState('dicom', ['studies', 'studyCount', 'selectedStudyId'])
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
