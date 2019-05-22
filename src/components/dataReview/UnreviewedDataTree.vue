<template>
  <div>
    <v-card class="pl-0">
      <v-sheet class="pa-3 primary lighten-2">
        <v-text-field
          v-model="search"
          label="Search Unreviewed Data"
          dark
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="far fa-times-circle"
        ></v-text-field>
        <v-checkbox
          v-model="caseSensitive"
          dark
          hide-details
          label="Case sensitive search"
        ></v-checkbox>
      </v-sheet>
      <v-card-text>
        <v-treeview
          activatable
          open-on-click
          transition
          v-model="tree"
          :active.sync="active"
          :filter="filter"
          :items="items"
          :load-children="loadChildren"
          :open.sync="open"
          :search="search"
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.icon">{{
              open ? "folder_open" : "folder"
            }}</v-icon>
            <v-icon v-else>{{ icons[item.icon] }}</v-icon>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "UnreviewedDataTree",
  created() {
    this.$store.dispatch("mri/getUnreviewedDicomPatientsAsTreeNodes");
  },
  data: () => ({
    tree: [],
    open: [],
    active: [],
    search: null,
    caseSensitive: false,
    icons: {
      subject: "person",
      dcm: "camera",
      nii: "camera"
    },
    items: [
      {
        id: 1,
        name: "DICOM",
        children: []
      },
      {
        id: 2,
        name: "NIfTI",
        children: []
      }
    ]
  }),
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    }
  },
  methods: {
    loadChildren(item) {
      if (item.name === "DICOM") {
        let unreviewedPatients = this.$store.state.mri
          .unreviewedDicomPatientsAsTreeNodes;
        item.children = unreviewedPatients;
      } else if (item.id.startsWith("dicom_patient_")) {
        let patient_id = item.id.split("_").pop();
        this.$store
          .dispatch("mri/getUnreviewedDicomSeriesAsTreeNodes", patient_id)
          .then(
            (item.children = this.$store.state.mri.unreviewedDicomSeriesAsTreeNodes.patient_id)
          );
      }
    }
  }
};
</script>

<style lang="scss">
.v-treeview-node__label {
  text-align: left;
}
</style>
