<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <router-link to="/">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>

        <router-link to="/">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Researchers</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>

        <router-link to="/review">
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
    <v-toolbar color="indigo" dark fixed app>
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
    drawer: null
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
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
