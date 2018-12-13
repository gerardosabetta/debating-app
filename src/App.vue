<template>
  <v-app id="app">
    <v-navigation-drawer fixed v-model="drawer" app>
      <v-list dense>
        <div v-if="logged">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="userInfo.photoURL" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ userInfo.displayName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile router :to="route.url" v-for="route in routes" :key="route.url" v-if="$route.name === route.showIn || route.showIn === '*' ">
            <v-list-tile-content>
              <v-list-tile-title v-text="route.description"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile router :to="`/room/${$route.params.id}/votation`" v-if="$route.name === 'Sala de debate' ">
            <v-list-tile-content>
              <v-list-tile-title>Votacion</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="openLogoutDialog()">
            <v-list-tile-action>
              <v-icon>close</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Salir</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
        <div v-else>
          Por favor, identificate para continuar
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="orange" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ this.$route.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <info-modal v-if="this.$route.params.id" :roomId="this.$route.params.id">
        <v-icon medium>info</v-icon>
      </info-modal>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-dialog v-model="logoutDialog" width="500">
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>Estas a punto de deslogearte</v-card-title>
              <v-card-text>Deseas continuar?</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" flat @click="logout">Si</v-btn>
                <v-btn color="primary" flat @click="logoutDialog = false">No</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <!-- <v-footer color="orange" app>
     <span class="white--text">Área técnica OAJNU Rosario &copy; 2017</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import firebase from 'firebase'
import InfoModal from './components/InfoModal'
export default {
  name: 'app',
  components: {
    InfoModal
  },
  data () {
    return {
      drawer: null,
      logged: false,
      userInfo: null,
      logoutDialog: false,
      routes: [
        { url: '/', description: 'Inicio', showIn: '*' },
        { url: '/create', description: 'Crear sala', showIn: '*' }
      ]
    }
  },
  created () {
    this.userInfo = firebase.auth().currentUser
    if (this.userInfo) {
      this.logged = true
      console.log(this.userInfo)
    }
  },
  methods: {
    logout () {
      firebase.auth().signOut().then(() => {
        this.logged = false
        this.logoutDialog = false
        this.userInfo = null
        this.$router.push('auth')
      })
    },
    openLogoutDialog () {
      this.logoutDialog = true
    }
  }
}
</script>

<style>
</style>
