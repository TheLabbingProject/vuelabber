<template>
  <div class="text-left">
    <div class="title">Subject #{{ subject.id }}</div>
    <hr />
    <v-tabs v-model="active">
      <v-tab>
        MRI
      </v-tab>
      <v-tab-item>
        <scan-table />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScanTable from '@/components/mri/scan-table.vue'

export default {
  name: 'SubjectInfo',
  components: {
    ScanTable
  },
  data: () => ({
    active: 0
  }),
  computed: {
    ...mapGetters('research', { subject: 'getSelectedSubject' })
  }
}
</script>

<style lang="scss" scoped></style>
