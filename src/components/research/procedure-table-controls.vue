<template>
  <v-container>
    <v-row v-if="showControls">
      <v-col :cols="2">
        <v-text-field label="Title" v-model="filters.title" />
      </v-col>
      <v-col>
        <v-text-field label="Description" v-model="filters.description" />
      </v-col>
      <v-spacer />
      <div class="pa-4">
        <v-dialog
          v-model="procedureAssociationDialog"
          width="600px"
          v-if="user.isStaff"
        >
          <template v-slot:activator="{ on }">
            <v-btn :class="addProcedureButton.cssClass" v-on="on">
              {{ addProcedureButton.label }}
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
  </v-container>
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
  mounted() {
    if (this.study) {
      this.filters.studies.push(this.study.id)
    } else {
      this.update()
    }
  },
  data: () => ({
    filters: {
      title: '',
      description: '',
      studies: []
    },
    addProcedureButton: {
      label: 'Add',
      cssClass: 'info'
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
