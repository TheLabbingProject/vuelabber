<template>
  <v-card>
    <v-card-text>
      <v-form>
        <v-col>
          <v-row>
            <v-col cols="11">
              <v-text-field
                v-model="inputDefinition.key"
                label="Key"
                readonly
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="inputDefinition.id"
                label="ID"
                disabled
                readonly
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="inputDefinition.description"
            label="Description"
            readonly
          />
          <v-row class="pr-5 align-center">
            <v-col>
              <v-select
                v-model="inputDefinition.type"
                label="Input Type"
                :items="inputTypes"
                readonly
              />
            </v-col>
            <v-col v-if="inputDefinition.type === 'List'">
              <v-select
                v-model="inputDefinition.elementType"
                label="Element Type"
                :items="listElementTypes"
                readonly
              />
            </v-col>
            <v-col v-if="'choices' in inputDefinition">
              <v-text-field
                v-model="inputDefinition.choices"
                label="Choices"
                readonly
              />
            </v-col>
            <div v-if="'default' in inputDefinition">
              <v-col v-if="inputDefinition.type != 'Boolean'">
                <v-text-field
                  v-model="inputDefinition.default"
                  label="Default"
                  readonly
                />
              </v-col>
              <v-col cols="1" v-else-if="inputDefinition.default != null">
                <v-switch
                  v-model="inputDefinition.default"
                  label="Default"
                  readonly
                />
              </v-col>
            </div>
            <v-col cols="1" v-if="hasBoundaries">
              <v-text-field
                v-if="hasLengthBoundaries"
                v-model="inputDefinition.minLength"
                label="Min. Length"
                type="number"
                readonly
              />
              <v-text-field
                v-else-if="hasValueBoundaries"
                v-model="inputDefinition.minValue"
                label="Min. Value"
                type="number"
                readonly
              />
            </v-col>
            <div v-if="hasBoundaries">
              -
            </div>
            <v-col cols="1" v-if="hasBoundaries">
              <v-text-field
                v-if="hasLengthBoundaries"
                v-model="inputDefinition.maxLength"
                label="Max. Length"
                type="number"
                readonly
              />
              <v-text-field
                v-else-if="hasValueBoundaries"
                v-model="inputDefinition.maxValue"
                label="Max. Value"
                type="number"
                readonly
              />
            </v-col>
            <v-col cols="1">
              <v-checkbox
                v-model="inputDefinition.required"
                label="Required"
                readonly
              />
            </v-col>
            <v-col cols="1">
              <v-checkbox
                v-model="inputDefinition.isConfiguration"
                label="Configurable"
                hint="Whether this input definition may be configured as part of pipeline node."
                readonly
              />
            </v-col>
          </v-row>
        </v-col>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'InputDefinitionConfiguration',
  props: { inputDefinition: Object },
  data: () => ({
    inputTypes: ['String', 'Integer', 'Float', 'List', 'Boolean', 'File'],
    listElementTypes: [
      { text: 'String', value: 'STR' },
      { text: 'Integer', value: 'INT' },
      { text: 'Float', value: 'FLT' },
      { text: 'Boolean', value: 'BLN' }
    ]
  }),
  computed: {
    hasLengthBoundaries: function() {
      return (
        'minLength' in this.inputDefinition &&
        'maxLength' in this.inputDefinition
      )
    },
    hasValueBoundaries: function() {
      return (
        'minValue' in this.inputDefinition && 'maxValue' in this.inputDefinition
      )
    },
    hasBoundaries: function() {
      return this.hasLengthBoundaries || this.hasValueBoundaries
    }
  }
}
</script>

<style lang="scss" scoped></style>
