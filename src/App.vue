<template>
  <v-app id="app">
    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" clipped absolute overflow app>
      <v-list dense>
        <!-- Home -->
        <v-list-item to="/home" class="drawer-link">
          <v-list-item-icon>
            <v-icon>
              home
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Home
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Studies -->
        <v-list-item to="/studies" class="drawer-link">
          <v-list-item-icon>
            <v-icon>
              star
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Studies
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Subjects -->
        <v-list-item to="/subjects" class="drawer-link">
          <v-list-item-icon>
            <v-icon>
              people
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Subjects
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Data -->
        <v-list-group no-action prepend-icon="storage" :value="false">
          <template v-slot:activator>
            <v-list-item-title class="drawer-link">
              Data
            </v-list-item-title>
          </template>

          <!-- MRI -->
          <v-list-group no-action sub-group :value="false">
            <template v-slot:activator>
              <v-list-item class="drawer-link pr-0">
                <v-list-item-title>
                  MRI
                </v-list-item-title>
                <v-list-item-icon>
                  <v-icon>
                    blur_on
                  </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </template>

            <!-- Sequence Types -->
            <v-list-item to="/mri-sequence-types" class="drawer-link">
              <v-list-item-title>
                Sequence Types
              </v-list-item-title>
            </v-list-item>

            <!-- DICOM -->
            <v-list-item to="/dicom-browser" class="drawer-link">
              <v-list-item-title>
                DICOM
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>

        <!-- Analyses -->
        <v-list-group no-action prepend-icon="equalizer" :value="false">
          <template v-slot:activator>
            <v-list-item-title class="drawer-link">
              Analyses
            </v-list-item-title>
          </template>

          <!-- Browse -->
          <v-list-item to="/analysis-browser" class="drawer-link">
            <v-list-item-title>
              Browse
            </v-list-item-title>
            <v-list-item-icon>
              <v-icon>
                search
              </v-icon>
            </v-list-item-icon>
          </v-list-item>

          <!-- Browse -->
          <v-list-item to="/run-browser" class="drawer-link">
            <v-list-item-title>
              Runs
            </v-list-item-title>
            <v-list-item-icon>
              <v-icon>
                format_list_bulleted
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar color="indigo" clipped-left dark absolute app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <!-- Title -->
      <v-toolbar-title>
        pylabber
      </v-toolbar-title>

      <v-spacer />

      <!-- User Menu -->
      <div class="text-xs-center" v-if="isAuthenticated && user">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              <v-avatar size="36px" class="user-avatar">
                <img :src="user.image" />
              </v-avatar>
              &nbsp; {{ user.username }}
            </v-btn>
          </template>
          <v-list>
            <router-link to="/logout" class="dropmenu-link">
              <v-list-item>
                Logout
              </v-list-item>
            </router-link>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Content -->
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>

    <!-- Footer -->
    <v-footer color="indigo" app>
      <span class="white--text"></span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data: () => ({
    drawer: {}
  }),
  created() {
    this.fetchCategories()
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('analysis', ['rootCategories']),
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('analysis', ['fetchCategories'])
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.drawer-link {
  text-align: left;
  text-decoration: none;
  color: black;
}

.dropmenu-link {
  text-decoration: none;
  color: black;
}
</style>
