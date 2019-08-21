<template>
  <v-layout column>
    <v-tabs v-model="active">
      <v-tab>
        MRI
      </v-tab>
      <v-tab-item>
        <br />
        <scan-table />
      </v-tab-item>
    </v-tabs>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ScanTable from '@/components/mri/scan-table.vue'

export default {
  name: 'SubjectData',
  components: {
    ScanTable
  },
  data: () => ({
    active: 0
  }),
  computed: {
    ...mapGetters('research', { subject: 'getSelectedSubject' })
  },
  methods: {
    ...mapMutations('research', ['setSelectedSubjectId'])
  }
}
</script>

<style scoped></style>
