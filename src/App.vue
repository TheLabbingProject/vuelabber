<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" clipped absolute overflow app>
      <v-list dense>
        <router-link to="/" class="drawer-link">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>

        <router-link to="/researchers" class="drawer-link">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Researchers</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>

        <router-link to="/review" class="drawer-link">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>storage</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Data</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" clipped-left dark absolute app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>pylabber</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-left align-top>
          <main>
            <router-view />
          </main>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text"></span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: {}
  }),
  props: {
    source: String
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.drawer-link {
  text-decoration: none;
  color: black;
}

a.router-link-exact-active {
  color: #3366bb;
}
</style>
