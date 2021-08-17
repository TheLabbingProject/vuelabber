<template>
  <div>
    <v-row class="px-3 pb-3">
      <div class="title text-left">Subjects</div>
      <v-spacer />
      <v-dialog
        v-model="createSubjectDialog"
        width="600px"
        v-if="currentUser.isStaff"
      >
        <template v-slot:activator="{ on }">
          <v-btn color="success" v-on="on">New Subject</v-btn>
        </template>
        <subject-info-card
          :createMode="true"
          @close-subject-dialog="closeSubjectDialog(false)"
          :key="subjectDialog"
        />
      </v-dialog>
    </v-row>
    <v-data-table
      dense
      item-key="id"
      show-expand
      single-expand
      :expanded.sync="expanded"
      :headers="headers"
      :items="subjects"
      :loading="loading"
      :options.sync="options"
      :server-items-length="subjectCount"
      :footer-props="{
        itemsPerPageOptions
      }"
    >
      <template v-slot:top>
        <subject-table-controls
          :options="options"
          @fetch-subjects-start="loading = true"
          @fetch-subjects-end="loading = false"
        />
      </template>

      <!-- ID Number -->
      <template v-slot:[`item.idNumber`]="{ item }" v-if="currentUser.isStaff">
        <v-edit-dialog
          :return-value.sync="item.idNumber"
          large
          @save="saveSubject(item, 'idNumber')"
        >
          <div>{{ item.idNumber }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.idNumber"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- First Name -->
      <template v-slot:[`item.firstName`]="{ item }" v-if="currentUser.isStaff">
        <v-edit-dialog
          :return-value.sync="item.firstName"
          large
          @save="saveSubject(item, 'firstName')"
        >
          <div>{{ item.firstName }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.firstName"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Last Name -->
      <template v-slot:[`item.lastName`]="{ item }" v-if="currentUser.isStaff">
        <v-edit-dialog
          :return-value.sync="item.lastName"
          large
          @save="saveSubject(item, 'lastName')"
        >
          <div>{{ item.lastName }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="item.lastName"
              label="Edit"
              single-line
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Date of Birth -->
      <template
        v-slot:[`item.dateOfBirth`]="{ item }"
        v-if="currentUser.isStaff"
      >
        <v-edit-dialog
          :return-value.sync="item.dateOfBirth"
          large
          @save="saveSubject(item, 'dateOfBirth')"
        >
          <div>
            {{ item.dateOfBirth | formatDate }}
          </div>
          <template v-slot:input>
            <v-date-picker
              v-model="item.dateOfBirth"
              @input="dateOfBirthMenu = false"
              scrollable
            >
              <template v-slot:default>
                <v-btn color="orange" @click="item.dateOfBirth = null">
                  Clear
                </v-btn>
              </template>
            </v-date-picker>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.dateOfBirth`]="{ item }" v-else>
        {{ item.dateOfBirth | formatDate }}
      </template>

      <!-- Sex -->
      <template v-if="currentUser.isStaff" v-slot:[`item.sex`]="{ item }">
        <v-edit-dialog
          :return-value.sync="item.sex"
          large
          @save="saveSubject(item, 'sex')"
        >
          <div>
            {{ getDisplay(item.sex, sexOptions) }}
          </div>
          <template v-slot:input>
            <v-select
              clearable
              label="Edit"
              v-model="item.sex"
              :items="sexItems"
            />
          </template>
        </v-edit-dialog>
      </template>
      <template v-else v-slot:[`item.sex`]="{ item }">
        {{ getDisplay(item.sex, sexOptions) }}
      </template>

      <!-- Gender -->
      <template v-if="currentUser.isStaff" v-slot:[`item.gender`]="{ item }">
        <v-edit-dialog
          :return-value.sync="item.gender"
          large
          @save="saveSubject(item, 'gender')"
        >
          <div>
            {{ getDisplay(item.gender, genderOptions) }}
          </div>
          <template v-slot:input>
            <v-select
              clearable
              label="Edit"
              v-model="item.gender"
              :items="genderItems"
            />
          </template>
        </v-edit-dialog>
      </template>
      <template v-else v-slot:[`item.gender`]="{ item }">
        {{ getDisplay(item.gender, genderOptions) }}
      </template>

      <!-- Dominant Hand -->
      <!-- <template
        v-if="currentUser.isStaff"
        v-slot:[`item.dominantHand`]="{ item }"
      >
        <v-edit-dialog
          :return-value.sync="item.dominantHand"
          large
          @save="saveSubject(item, 'dominantHand')"
        >
          <div>
            {{ getDisplay(item.dominantHand, dominantHandOptions) }}
          </div>
          <template v-slot:input>
            <v-select
              clearable
              label="Edit"
              v-model="item.dominantHand"
              :items="dominantHandItems"
            />
          </template>
        </v-edit-dialog>
      </template>
      <template v-else v-slot:[`item.dominantHand`]="{ item }">
        {{ getDisplay(item.dominantHand, dominantHandOptions) }}
      </template> -->

      <template v-slot:[`item.latestMriSessionTime`]="{ item }">
        {{ item.latestMriSessionTime | formatDateTime }}
      </template>

      <!-- <template v-slot:[`item.created`]="{ item }">
        {{ item.created | formatDateTime }}
      </template>

      <template v-slot:[`item.modified`]="{ item }">
        {{ item.modified | formatDateTime }}
      </template> -->

      <template v-slot:[`item.studies`]="{ item }">
        <v-row no-gutters>
          <template v-for="n in Array(item.studies.length).keys()">
            <v-col class="py-1" :key="n">
              <v-chip class="pa-1" small>
                <div class="pa-1">
                  {{ item.studies[n].title }}
                </div>
              </v-chip>
            </v-col>
            <v-responsive
              v-if="n === 2"
              :key="`width-${n}`"
              width="100%"
            ></v-responsive>
          </template>
        </v-row>
      </template>

      <!-- Edit dialog -->
      <template v-slot:[`item.edit`]="{ item }" v-if="currentUser.isStaff">
        <v-dialog v-model="editSubjectDialog[item.id]" width="600px">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">edit</v-icon>
          </template>
          <subject-info-card
            :existingSubject="item"
            @close-subject-dialog="true, item"
          />
        </v-dialog>
      </template>

      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="subject-data pa-0 ma-0">
          <subject-data :subject="item" />
          <hr />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import SubjectData from '@/components/research/subject-data.vue'
import SubjectInfoCard from '@/components/research/subject-info-card.vue'
import SubjectTableControls from '@/components/research/subject-table-controls.vue'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { mapActions, mapState } from 'vuex'
import { createSelectItems } from '@/components/utils'

export default {
  name: 'SubjectTable',
  components: {
    SubjectData,
    SubjectInfoCard,
    SubjectTableControls
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'idNumber', align: 'center', width: 75 },
      { text: 'First Name', value: 'firstName' },
      { text: 'Last Name', value: 'lastName' },
      { text: 'Date of Birth', value: 'dateOfBirth', align: 'center' },
      { text: 'Sex', value: 'sex', align: 'center' },
      // { text: 'Gender', value: 'gender', sortable: false },
      // { text: 'Dominant Hand', value: 'dominantHand' },
      {
        text: 'Latest MRI Session',
        value: 'latestMriSessionTime',
        align: 'center'
      },
      {
        text: 'MRI Session Count',
        value: 'mriSessionCount',
        align: 'center',
        width: 160
      },
      {
        text: 'Study Association',
        value: 'studies',
        align: 'center',
        width: 200
      }
      // { text: 'Created', value: 'created', align: 'center' },
      // { text: 'Modified', value: 'modified', align: 'center' }
    ],
    options: {
      itemsPerPage: 25,
      page: 1,
      sortBy: ['latestMriSessionTime'],
      sortDesc: [true]
    },
    editHeader: { text: 'Edit', value: 'edit' },
    itemsPerPageOptions: [10, 25, 50, 100],
    loading: false,
    editSubjectDialog: {},
    expanded: [],
    expand: true,
    sexOptions,
    genderOptions,
    dominantHandOptions,
    subjectDialog: false,
    createSubjectDialog: false,
    dateOfBirthMenu: false,
    sexItems: createSelectItems(sexOptions),
    genderItems: createSelectItems(genderOptions),
    dominantHandItems: createSelectItems(dominantHandOptions)
  }),
  computed: {
    ...mapState('research', ['subjects', 'subjectCount']),
    ...mapState('auth', { currentUser: 'user' })
  },
  methods: {
    closeSubjectDialog(updating, item) {
      if (updating) this.editSubjectDialog[item.id] = false
      else this.createSubjectDialog = false
      this.subjectDialog = !this.subjectDialog
    },
    appendEditColumn() {
      if (this.currentUser.isStaff) {
        this.headers.push(this.editHeader)
      }
    },
    saveSubject(subject, field) {
      let value = subject[field] == 'null' ? '' : subject[field] || ''
      let data = { subjectId: subject.id, [field]: value }
      this.updateSubjectPartial(data)
    },
    getDisplay(value, options) {
      let display = options[value]
      return display == 'Unknown' ? '' : display
    },
    ...mapActions('accounts', ['fetchUsers']),
    ...mapActions('research', ['updateSubjectPartial'])
  }
}
</script>

<style scoped>
tr.selected {
  background-color: #e4f3ff;
}
td.subject-data {
  background-color: #dfe9fd;
}
</style>
