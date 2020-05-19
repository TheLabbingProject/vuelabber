<template>
  <v-col>
    <subject-table />
  </v-col>
</template>

<script>
import SubjectTable from '@/components/research/subject-table.vue'

export default {
  name: 'SubjectBrowser',
  components: { SubjectTable }
}
</script>

<style scoped></style>
