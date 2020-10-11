<template>
  <div class="text-xs-center" v-if="room">
    <v-dialog v-model="dialog" width="500">
      <v-btn slot="activator" flat icon>
        <slot></slot>
      </v-btn>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Información de la sala {{ room.name }}
        </v-card-title>

        <v-card-text>
          <p>Descripción de la sala: {{ room.description }}</p>
          <v-list v-if="participants">
            <v-subheader>Usuarios ({{ participants.length }})</v-subheader>
            <v-list-tile avatar v-for="(participant, idx) in participants" :key="idx">
              <v-list-tile-avatar>
                <img :src="participant.photo" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-text="participant.displayName"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon small :color="participant.state === 'online' ? 'green' : 'red'">face</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
import { rooms } from '../firebase'

export default {
  props: ['roomId'],
  data () {
    return {
      dialog: false,
      room: null,
      participants: []
    }
  },
  firestore () {
    return {
      room: rooms.doc(this.roomId)
    }
  },
  created () {
    firebase.database().ref(`/status/${this.roomId}`)
    .on('value', snapshot => {
      this.participants = snapshot.val()
    })
  }
}
</script>

