<template>
  <div>
    <v-data-table
      :rows-per-page-items="[
        10,
        25,
        50,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ]"
      :headers="headers"
      :items="patients"
      :expand="expand"
      item-key="uid"
    >
      <template v-slot:items="props">
        <tr @click="props.expanded = !props.expanded">
          <td class="text-xs-left">{{ props.item.uid }}</td>
          <td class="text-xs-left">{{ props.item.givenName }}</td>
          <td class="text-xs-left">{{ props.item.familyName }}</td>
          <td class="text-xs-left">{{ props.item.sex }}</td>
          <td class="text-xs-left">{{ props.item.dateOfBirth }}</td>
        </tr>
      </template>
      <template v-slot:expand="props">
        <v-card flat>
          <series-table :patient="props.item"></series-table>
        </v-card>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
import SeriesTable from './series-table.vue'
const camelcaseKeys = require('camelcase-keys')

export default {
  name: 'ReviewTable',
  created() {
    this.getDicomPatients()
  },
  components: { SeriesTable },
  data: () => ({
    expand: false,
    headers: [
      {
        text: 'UID',
        align: 'left',
        sortable: false,
        value: 'uid'
      },
      { text: 'First Name', value: 'givenName' },
      { text: 'Last Name', value: 'familyName' },
      { text: 'Sex', value: 'sex' },
      { text: 'Date of Birth', value: 'dateOfBirth' }
    ],
    patients: [],
    tempSeriesList: null
  }),
  methods: {
    getDicomPatients: function() {
      return axios
        .get('/api/dicom/patients/')
        .then(
          ({ data }) =>
            (this.patients = data.results.map(item => camelcaseKeys(item)))
        )
        .catch(console.error)
    }
  }
}
</script>

<style lang="scss" scoped>
td {
  vertical-align: middle;
}
</style>
