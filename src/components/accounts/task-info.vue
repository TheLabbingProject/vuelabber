<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field label="Worker" v-model="task.worker"> </v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Status" v-model="task.status"> </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          v-model="taskArgs"
          label="Positional Arguments"
          rows="4"
          cols="40"
        />
      </v-col>
      <v-col>
        <v-textarea
          v-model="taskKwargs"
          label="Keyword Arguments"
          rows="4"
          cols="40"
        />
      </v-col>
      <v-col>
        <v-textarea v-model="taskMeta" label="Metadata" rows="4" cols="40" />
      </v-col>
    </v-row>
    <v-row v-if="task.traceback">
      <v-col>
        <v-textarea
          v-model="task.traceback"
          label="Traceback"
          rows="8"
          cols="40"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TaskInfo',
  props: { task: Object },
  computed: {
    taskMeta: function() {
      return this.jsonify(this.task.meta)
    },
    taskArgs: function() {
      return this.jsonify(this.task.taskArgs)
    },
    taskKwargs: function() {
      return this.jsonify(this.task.taskKwargs)
    }
  },
  methods: {
    jsonify: function(value) {
      try {
        return JSON.stringify(JSON.parser(value), null, 2)
      } catch (error) {
        return JSON.stringify(value, null, 2)
      }
    }
  }
}
</script>

<style></style>
