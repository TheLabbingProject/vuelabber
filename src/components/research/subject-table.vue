<template>
  <v-data-table
    item-key="id"
    :headers="headers"
    :items="subjects"
    :rows-per-page-items="[
      10,
      25,
      50,
      { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
    ]"
  >
    <template v-slot:items="props">
      <tr
        @click="setSelectedSubjectId(props.item.id)"
        :class="{ selected: props.item.id === selectedSubjectId }"
      >
        <td class="text-xs-left">
          {{ props.item.id }}
        </td>

        <td class="text-xs-left">
          {{ props.item.firstName }}
        </td>
        <td class="text-xs-left">
          {{ props.item.lastName }}
        </td>
        <td class="text-xs-left">
          {{ props.item.dateOfBirth }}
        </td>
        <td class="text-xs-left">
          {{ getSubjectSexDisplay(props.item) }}
        </td>
        <td class="text-xs-left">
          {{ getSubjectGenderDisplay(props.item) }}
        </td>
        <td class="text-xs-left">
          {{ getSubjectDominantHandDisplay(props.item) }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'SubjectTable',
  created() {
    this.fetchSubjects()
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id', align: 'left' },
      { text: 'First Name', value: 'givenName' },
      { text: 'Last Name', value: 'familyName' },
      { text: 'Date of Birth', value: 'dateOfBirth' },
      { text: 'Sex', value: 'sex' },
      { text: 'Gender', value: 'gender' },
      { text: 'Dominant Hand', value: 'dominantHand' }
    ],
    sexOptions: { Male: 'M', Female: 'F', Other: 'O' },
    genderOptions: { Cisgender: 'CIS', Transgender: 'TRANS', Other: 'OTHER' },
    dominantHandOptions: { Right: 'R', Left: 'L', Ambidextrous: 'A' }
  }),
  computed: {
    ...mapState('research', ['subjects', 'selectedSubjectId'])
  },
  methods: {
    getSubjectSexDisplay: function(subject) {
      return getKeyByValue(this.sexOptions, subject.sex)
    },
    getSubjectGenderDisplay: function(subject) {
      return getKeyByValue(this.genderOptions, subject.gender)
    },
    getSubjectDominantHandDisplay: function(subject) {
      return getKeyByValue(this.dominantHandOptions, subject.dominantHand)
    },
    ...mapActions('research', ['fetchSubjects']),
    ...mapMutations('research', ['setSelectedSubjectId'])
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}
</script>

<style lang="scss" scoped>
tr.selected {
  background-color: #b3d4fc77;
}
</style>
