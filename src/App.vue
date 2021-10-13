<template>
  <v-app id="app">
    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" clipped absolute overflow app>
      <v-list dense>
        <!-- Home -->
        <v-list-item :to="homeItem.destination" class="drawer-link">
          <v-list-item-icon>
            <v-icon>
              {{ homeItem.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ homeItem.label }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Studies -->
        <v-list-item :to="studiesItem.destination" class="drawer-link">
          <v-list-item-icon>
            <v-icon>
              {{ studiesItem.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ studiesItem.label }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Subjects -->
        <v-list-item :to="subjectsItem.destination" class="drawer-link">
          <v-list-item-icon>
            <v-icon>
              {{ subjectsItem.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ subjectsItem.label }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- MRI Browser -->
        <v-list-item :to="mriBrowserItem.destination" class="drawer-link">
          <v-list-item-icon>
            <v-icon>
              {{ mriBrowserItem.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ mriBrowserItem.label }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Analyses -->
        <v-list-group no-action :prepend-icon="analysesItem.icon">
          <template v-slot:activator>
            <v-list-item-title class="drawer-link">
              {{ analysesItem.label }}
            </v-list-item-title>
          </template>

          <!-- Browse -->
          <v-list-item
            :to="analysesBrowserItem.destination"
            class="drawer-link"
          >
            <v-list-item-title>
              {{ analysesBrowserItem.label }}
            </v-list-item-title>
            <v-list-item-icon>
              <v-icon>
                {{ analysesBrowserItem.icon }}
              </v-icon>
            </v-list-item-icon>
          </v-list-item>

          <!-- Runs -->
          <v-list-item :to="runsItem.destination" class="drawer-link">
            <v-list-item-title>
              {{ runsItem.label }}
            </v-list-item-title>
            <v-list-item-icon>
              <v-icon>
                {{ runsItem.icon }}
              </v-icon>
            </v-list-item-icon>
          </v-list-item>

          <!-- Pipelines -->
          <v-list-item :to="pipelinesItem.destination" class="drawer-link">
            <v-list-item-title>
              {{ pipelinesItem.label }}
            </v-list-item-title>
            <v-list-item-icon>
              <v-icon>
                {{ pipelinesItem.icon }}
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <!-- Tasks -->
        <v-list-item :to="tasksItem.destination" class="drawer-link">
          <v-list-item-icon>
            <v-icon>
              {{ tasksItem.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ tasksItem.label }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Advanced Options -->
        <v-list-group
          no-action
          :prepend-icon="advancedItem.icon"
          :value="false"
        >
          <template v-slot:activator>
            <v-list-item-title class="drawer-link">
              {{ advancedItem.label }}
            </v-list-item-title>
          </template>

          <!-- Sequence Types -->
          <v-list-item :to="sequenceTypesItem.destination" class="drawer-link">
            <v-list-item-title>
              {{ sequenceTypesItem.label }}
            </v-list-item-title>
            <v-list-item-icon>
              <v-icon>
                {{ sequenceTypesItem.icon }}
              </v-icon>
            </v-list-item-icon>
          </v-list-item>

          <!-- DICOM -->
          <v-list-item :to="dicomBrowserItem.destination" class="drawer-link">
            <v-list-item-title>
              {{ dicomBrowserItem.label }}
            </v-list-item-title>
            <v-list-item-icon>
              <v-icon>
                {{ dicomBrowserItem.icon }}
              </v-icon>
            </v-list-item-icon>
          </v-list-item>

          <!-- BrainBrowser -->
          <!-- <v-list-item to="/brain-browser" class="drawer-link">
              <v-list-item-title>Brain Browser</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-brain</v-icon>
              </v-list-item-icon>
            </v-list-item> -->
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar color="indigo" clipped-left dark absolute app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <!-- Title -->
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>

      <v-spacer />

      <!-- User Menu -->
      <div class="text-xs-center" v-if="isAuthenticated && user">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              <v-avatar size="36px" class="user-avatar">
                <img
                  v-if="user.profile && user.profile['image']"
                  :src="user.profile['image']"
                />
                <img v-else :src="defaultUserImage" />
              </v-avatar>
              &nbsp; {{ user.username }}
            </v-btn>
          </template>
          <v-list>
            <router-link :to="logoutItem.destination" class="dropmenu-link">
              <v-list-item>
                {{ logoutItem.label }}
              </v-list-item>
            </router-link>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Content -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer color="indigo" app>
      <span class="white--text"></span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data: () => ({
    title: 'pylabber',
    drawer: {},
    homeItem: { label: 'Home', icon: 'home', destination: '/home' },
    studiesItem: { label: 'Studies', icon: 'star', destination: '/studies' },
    subjectsItem: {
      label: 'Subjects',
      icon: 'people',
      destination: '/subjects'
    },
    mriBrowserItem: {
      label: 'MRI Browser',
      icon: 'blur_on',
      destination: '/mri-browser'
    },
    advancedItem: {
      label: 'Advanced',
      icon: 'settings'
    },
    analysesItem: {
      label: 'Analyses',
      icon: 'equalizer'
    },
    analysesBrowserItem: {
      label: 'Browser',
      icon: 'search',
      destination: '/analysis-browser'
    },
    runsItem: {
      label: 'Runs',
      icon: 'format_list_bulleted',
      destination: '/run-browser'
    },
    pipelinesItem: {
      label: 'Pipelines',
      icon: 'timeline',
      destination: '/pipeline-browser'
    },
    tasksItem: {
      label: 'Tasks',
      icon: 'timer',
      destination: '/tasks'
    },
    sequenceTypesItem: {
      label: 'MRI Sequence Types',
      icon: 'list',
      destination: '/mri-sequence-types'
    },
    dicomBrowserItem: {
      label: 'DICOM Browser',
      icon: 'mdi-remote-desktop',
      destination: '/dicom-browser'
    },
    logoutItem: {
      label: 'Logout',
      destination: '/logout'
    },
    defaultUserImage: '/user.png'
  }),
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('analysis', ['rootCategories']),
    ...mapState('auth', ['user'])
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
