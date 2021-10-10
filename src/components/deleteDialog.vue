<template>
  <v-card>
    <v-card-title class="error darken-2">
      <div class="headline">
        <span class="white--text">
          {{ title }}
        </span>
      </div>
    </v-card-title>
    <v-card-text>
      {{ text }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text color="info" @click="closeDialog">Cancel</v-btn>
      <v-btn text color="error" @click="execute">Delete</v-btn>
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
  data: () => ({
    title: 'Confirm Delete',
    text: 'Are you completely sure you would like to remove this item?'
  }),
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
      this.closeDialog()
    },
    closeDialog: function() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="scss" scoped></style>
