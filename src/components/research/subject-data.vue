<template>
  <v-layout column>
    <v-layout row px-3>
      <div class="title text-left pb-3">Subject #{{ subject.id }}</div>
      <v-spacer />
      <v-icon @click="setSelectedSubjectId(null)">close</v-icon>
    </v-layout>
    <v-flex>
      <v-tabs v-model="active">
        <v-tab>
          MRI
        </v-tab>
        <v-tab-item>
          <br />
          <scan-table />
        </v-tab-item>
      </v-tabs>
    </v-flex>
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
