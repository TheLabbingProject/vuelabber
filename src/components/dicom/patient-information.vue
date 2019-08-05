<template>
  <div>
    <v-form>
      <h3>Patient Information</h3>
      <v-layout row wrap>
        <v-text-field
          v-model="patient.uid"
          id="uid-input"
          type="text"
          label="Unique Identifier"
        />
        <v-spacer />
        <v-text-field
          v-show="patient.namePrefix"
          v-model="patient.namePrefix"
          id="name-prefix-input"
          type="text"
          label="Prefix"
        />
        <v-text-field
          v-model="patient.givenName"
          id="given-name-input"
          type="text"
          label="Given Name"
        />
        <v-text-field
          v-show="patient.middleName"
          v-model="patient.middleName"
          id="middle-name-input"
          type="text"
          label="Middle Name"
        />
        <v-text-field
          v-model="patient.familyName"
          id="family-name-input"
          type="text"
          label="Family Name"
        />
        <v-text-field
          v-show="patient.nameSuffix"
          v-model="patient.nameSuffix"
          id="name-suffix-input"
          type="text"
          label="Suffix"
        />
      </v-layout>
      <v-layout row wrap>
        <v-flex>
          <v-select
            v-model="patientSex"
            label="Sex"
            menu-props="auto"
            hide-details
            single-line
            :items="['Male', 'Female', 'Other']"
            :prepend-icon="sexIcon"
          ></v-select>
        </v-flex>
        <v-flex>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="patient.dateOfBirth"
                label="Date of Birth"
                prepend-icon="cake"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="patient.dateOfBirth"
              @input="dateMenu = false"
              :max="new Date().toISOString().substr(0, 10)"
            />
          </v-menu>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'PatientInformation',
  props: { patient: Object },
  data: () => ({
    sexIcon: 'wc',
    dateMenu: null
  }),
  computed: {
    patientSex: function() {
      if (this.patient.sex === 'M') {
        return 'Male'
      } else if (this.patient.sex === 'F') {
        return 'Female'
      } else if (this.patient.sex === 'O') {
        return 'Other'
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped></style>
