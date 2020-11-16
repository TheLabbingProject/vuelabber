<template>
  <v-col>
    <v-tabs v-model="active">
      <v-tab>Collaborators</v-tab>
      <v-tab>Procedures</v-tab>
    </v-tabs>
  </v-col>
</template>

<script>
export default {
  name: 'StudyInfo',
  props: {
    subject: Object
  },
  components: {},
  data: () => ({
    active: 0
  })
}
</script>

<style scoped></style>
