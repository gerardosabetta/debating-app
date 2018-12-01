<template>
  <v-flex xs12 lg4 v-if="room">
    <v-card color="blue-grey darken-2" class="white--text" v-if="room.speaking && room.speaking.name">
      <v-card-media class="white--text" height="400px" :src="room.speaking.photo">
      </v-card-media>
      <v-card-title primary-title>
        <div>
          <div class="headline">{{room.speaking.name}}</div>
          <span class="grey--text">{{room.speaking.name}} tiene {{room.speaking.time}} minutos para hablar. <br> Está haciendo uso de la palabra
            <span>{{ new Date(room.speaking.timestamp) | moment("from", "now") }}.</span>
          </span>
        </div>
      </v-card-title>
    </v-card>
    <votation v-if="room.votation && room.votation.isActive" :votationInfo="room.votation"></votation>
    <v-btn block color="secondary" dark @click="addSpeaker()">Agregarme a la lista de oradores</v-btn>
    <v-btn v-if="room.canInterpelate && room.speaking" block color="secondary" dark @click="addInterpelation()">Quiero interpelar a {{room.speaking.name}}</v-btn>

    <v-list v-if="room.speaking && room.speaking.name && interpellatorsList.length">
      <v-subheader>Personas que quieren interpelar a {{room.speaking.name}}</v-subheader>
      <v-list-tile avatar v-for="interpellator in interpellatorsList" :key="interpellator.name">
        <v-list-tile-avatar>
          <img :src="interpellator.photo" />
        </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="interpellator.name"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="me.uid === interpellator.uid">
            <v-btn flat color="red" dark @click.native.stop="removeMeAsking = true">...</v-btn>
            <v-dialog v-model="removeMeAsking" max-width="400">
              <v-card>
                <v-card-title class="headline">¿Queres salir de la lista de interpeladores?</v-card-title>
                <v-card-text>Estas a punto de salir de la lista de interpeladores</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn left color="red darken-1" flat="flat" @click.native="removeMeFromInterpellators()">Si, borrarme</v-btn>
                  <v-btn color="green darken-1" flat="flat" @click.native="removeMeAsking = false">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-list v-if="speakersList.length">
      <v-subheader>Personas que quieren hablar</v-subheader>
      <v-list-tile avatar v-for="(speaker, idx) in speakersList" :key="idx">
        <v-list-tile-avatar>
          <img :src="speaker.photo" />
        </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="speaker.name"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="me.uid === speaker.uid">
            <v-btn flat color="red" dark @click.native.stop="removeMeSpeaking = true">...</v-btn>
            <v-dialog v-model="removeMeSpeaking" max-width="400">
              <v-card>
                <v-card-title class="headline">¿Queres salir de la lista de oradores?</v-card-title>
                <v-card-text>Estas a punto de salir de la lista de oradores</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn left color="red darken-1" flat="flat" @click.native="removeMeFromSpeakers()">Si, borrarme</v-btn>
                  <v-btn color="green darken-1" flat="flat" @click.native="removeMeSpeaking = false">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-snackbar :timeout="timeout" color="red" :vertical="true" v-model="alreadySpeaker">
      Ya estas en la lista de oradores.
      <v-btn dark flat @click.native="alreadySpeaker = false">Ok</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="timeout" color="red" :vertical="true" v-model="alreadyQuestion">
      Ya estas en la lista de interpeladores.
      <v-btn dark flat @click.native="alreadyQuestion = false">Ok</v-btn>
    </v-snackbar>
  </v-flex>
</template>

<script>
import firebase from 'firebase'
import { rooms } from '../firebase'
import Votation from '../components/Votation.vue'
import { debateLog } from '../utils/logger.js'
export default {
  data () {
    return {
      room: null,
      speakersList: [],
      interpellatorsList: [],
      votes: [],
      name: '',
      photo: '',
      user: {},
      alreadySpeaker: false,
      removeMeSpeaking: false,
      removeMeAsking: false,
      alreadyQuestion: false,
      timeout: 4000
    }
  },
  components: {
    Votation
  },
  firestore () {
    return {
      room: rooms.doc(this.$route.params.id),
      speakersList: rooms.doc(this.$route.params.id).collection('speakersList').orderBy('timestamp'),
      interpellatorsList: rooms.doc(this.$route.params.id).collection('interpellatorsList'),
      votes: rooms.doc(this.$route.params.id).collection('votes')
    }
  },
  created () {
    this.me = firebase.auth().currentUser
    var userStatusDatabaseRef = firebase.database().ref('/status/' + this.$route.params.id + '/' + this.me.uid)
    var userStatusFirestoreRef = firebase.firestore().doc('/rooms/' + this.$route.params.id + '/participants/' + this.me.uid)
    var isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
      displayName: this.me.displayName,
      photo: this.me.photoURL
    }

    var isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
      displayName: this.me.displayName,
      photo: this.me.photoURL
    }

    var isOfflineForFirestore = {
      state: 'offline',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      displayName: this.me.displayName,
      photo: this.me.photoURL
    }

    var isOnlineForFirestore = {
      state: 'online',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      displayName: this.me.displayName,
      photo: this.me.photoURL
    }

    firebase.database().ref('.info/connected').on('value', function (snapshot) {
      if (snapshot.val() === false) {
        userStatusFirestoreRef.set(isOfflineForFirestore)
        return
      }

      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
        userStatusFirestoreRef.set(isOnlineForFirestore)
        userStatusDatabaseRef.set(isOnlineForDatabase)
      })
    })
  },
  beforeRouteLeave (to, from, next) {
    var isOfflineForFirestore = {
      state: 'offline',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      displayName: this.me.displayName,
      photo: this.me.photoURL
    }
    var isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
      displayName: this.me.displayName,
      photo: this.me.photoURL
    }
    // TODO: Mover el codigo repetido a utils
    var userStatusDatabaseRef = firebase.database().ref('/status/' + this.$route.params.id + '/' + this.me.uid)
    var userStatusFirestoreRef = firebase.firestore().doc('/rooms/' + this.$route.params.id + '/participants/' + this.me.uid)
    userStatusFirestoreRef.set(isOfflineForFirestore)
    userStatusDatabaseRef.set(isOfflineForDatabase)

    console.log('ESKEREEEEE')
    next()
  },
  filters: {
    firstName: function (value) {
      return value.toString().split(' ')[0]
    }
  },
  methods: {
    addSpeaker () {
      if (this.speakersList.some(speaker => speaker.id === this.me.uid)) {
        this.alreadySpeaker = true
      } else {
        rooms.doc(this.$route.params.id).collection('speakersList').doc(this.me.uid).set({
          uid: this.me.uid,
          name: this.me.displayName,
          photo: this.me.photoURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          debateLog(this.$route.params.id, 'ESKEREEEEE')
        })
      }
    },
    addInterpelation () {
      if (this.interpellatorsList.some(speaker => speaker.id === this.me.uid)) {
        this.alreadyQuestion = true
      } else {
        rooms.doc(this.$route.params.id).collection('interpellatorsList').doc(this.me.uid).set({
          uid: this.me.uid,
          name: this.me.displayName,
          photo: this.me.photoURL
        })
      }
    },
    removeMeFromSpeakers () {
      rooms.doc(this.$route.params.id)
        .collection('speakersList')
        .doc(this.me.uid)
        .delete()
        .then(
          deleted => {
            this.removeMeSpeaking = false
          }
        ).catch(
          error => console.log(error)
        )
    },
    removeMeFromInterpellators () {
      rooms.doc(this.$route.params.id)
        .collection('interpellatorsList')
        .doc(this.me.uid)
        .delete()
        .then(
          deleted => {
            this.removeMeAsking = false
          }
        ).catch(
          error => console.log(error)
        )
    }
  }
}
</script>

<style>
</style>
