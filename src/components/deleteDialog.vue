<template>
  <v-card>
    <v-card-title class="error darken-2">
      <div class="headline">
        <span class="white--text">
          Confirm Delete
        </span>
      </div>
    </v-card-title>
    <v-card-text>
      Are you completely sure you would like to remove this item?
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text class="info" @click="closeDialog">
        Cancel
      </v-btn>
      <v-btn text class="error" @click="execute">
        Delete
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: {
    action: Function,
    input: Object
  },
  methods: {
    execute: function() {
      if (
        // Check if input object is empty (== {})
        Object.entries(this.input).length === 0 &&
        this.input.constructor === Object
      ) {
        this.action()
      } else {
        this.action(this.input)
      }
    },
    closeDialog: function() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="scss" scoped></style>
