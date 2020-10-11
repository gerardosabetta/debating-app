<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 v-for="(room, idx) in sortedRoomsByCreatedDate" :key="idx">
        <v-card>
          <v-card-media src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px">
          </v-card-media>

          <v-card-title primary-title>
            <div>
              <div class="headline">{{ room.name }}</div>
              <span class="grey--text">{{ room.description }}</span>
            </div>
          </v-card-title>

          <v-card-actions>
              <router-link class="link" tag="button" :to="'/room/' + room.id">
                <v-btn flat>
                    Ingresar
                </v-btn>
              </router-link>
            <v-spacer></v-spacer>
            <info-modal :roomId="room.id">
              <v-icon>person</v-icon> <span v-numberOfOnlineUsers="room"></span>
            </info-modal>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import { sortedRoomsByCreatedDate } from '../firebase'
import InfoModal from '../components/InfoModal'

export default {
  data () {
    return {
      sortedRoomsByCreatedDate: []
    }
  },
  components: {
    InfoModal
  },
  directives: {
    numberOfOnlineUsers: {
      inserted (el, bind) {
        firebase.database().ref(`/status/${bind.value.id}`)
        .orderByChild('state')
        .equalTo('online')
        .on('value', snapshot => {
          el.innerText = Object.entries(snapshot.val() || {}).length
        })
      }
    }
  },
  firestore () {
    return {
      sortedRoomsByCreatedDate
    }
  }
}
</script>

<style scoped>
.link {
  text-decoration: none;
}
</style>
