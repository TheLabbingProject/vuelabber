<template>
  <v-row class="px-4 align-left" v-if="showControls">
    <v-col class="pl-8" :cols="1" style="max-width: 80px;">
      <v-text-field label="ID" v-model="filters.id" />
    </v-col>
    <v-col :cols="2">
      <v-text-field
        label="Title"
        v-model="filters.title"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
    <v-col>
      <v-text-field
        label="Description"
        v-model="filters.description"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
    <v-spacer />
    <div class="pr-2">
      <v-dialog
        v-model="procedureAssociationDialog"
        width="600px"
        v-if="user.isStaff"
      >
        <template v-slot:activator="{ on }">
          <v-btn color="success" v-on="on">
            <v-icon>
              add
            </v-icon>
          </v-btn>
        </template>
        <study-procedure-association-card
          @close-procedure-association-dialog="
            procedureAssociationDialog = false
          "
          @new-procedure-created="update"
          @existing-procedure-associated="update"
          :study="study"
        />
      </v-dialog>
    </div>
  </v-row>
</template>

<script>
import StudyProcedureAssociationCard from '@/components/research/study-procedure-association-card.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ProcedureTableControls',
  components: { StudyProcedureAssociationCard },
  props: {
    options: Object,
    study: { type: Object, default: undefined },
    showControls: { type: Boolean, default: true }
  },
  created() {
    if (this.study) {
      this.filters.studyId = this.study.id
    }
    this.update()
  },
  data: () => ({
    filters: {
      id: '',
      title: '',
      description: ''
    },
    procedureAssociationDialog: false
  }),
  computed: {
    query: function() {
      return { filters: this.filters, options: this.options }
    },
    ...mapState('auth', ['user'])
  },
  methods: {
    update() {
      this.$emit('fetch-procedures-start')
      this.fetchProcedures(this.query).then(() => {
        this.$emit('fetch-procedures-end')
      })
    },
    ...mapActions('research', ['fetchProcedures'])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    options: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
