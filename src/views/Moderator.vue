<template>
<v-flex xs12 lg8 v-if="room">
  <h2 v-if="room.speaking">{{ room.speaking.name }} tiene la palabra</h2>
  <v-card v-else>
    <v-subheader>Nadie está hablando en este momento.</v-subheader>
  </v-card>
  <v-list v-if="interpellatorsList.length">
    <v-subheader>Personas que quieren interpelar a {{ room.speaking.name }}</v-subheader>
    <v-list-tile avatar v-for="asker in interpellatorsList" :key="asker.name" >
      <v-list-tile-avatar>
        <img :src="asker.photo"/>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title v-text="asker.name"></v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-icon color="gray" @click="removeQuestion(asker.uid)">delete</v-icon>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
<br>
  <v-card>
    <v-list v-if="speakersList.length">
      <v-subheader>Personas que quieren hablar</v-subheader>
      <v-dialog
        v-model="nextSpeakerDialog"
        max-width="400">
        <v-card>
          <v-card-title class="headline">Vas a cambiar de orador</v-card-title>
          <v-card-text>{{nextSpeakerCandidate.name}} va a ser el próximo orador</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn left color="red darken-1" flat="flat" @click.native="removeSpeaker(nextSpeakerCandidate.uid)">Eliminar</v-btn>
            <v-btn color="green darken-1" flat="flat" @click.native="nextSpeakerDialog = false">Cancelar</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="setAsSpeaker(nextSpeakerCandidate)">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-list-tile avatar v-for="speaker in speakersList" :key="speaker['.key']" >
        <v-list-tile-avatar>
          <img :src="speaker.photo"/>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="speaker.name"></v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn flat color="primary" dark @click.native.stop="setNewSpeakerDialog(speaker)">...</v-btn>
          <!-- <v-icon color="gray" @click="removeSpeaker(speaker['.key'])">delete</v-icon> -->
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-card>
  <div v-if="room.speaking && room.speaking.name">
    <v-btn v-if="!room.canInterpelate" block color="secondary" dark @click="toggleQuestions(true)">Activar interpelaciones</v-btn>
    <v-btn v-if="room.canInterpelate"  block color="secondary" dark @click="toggleQuestions(false)">Desactivar interpelaciones</v-btn>
    <v-dialog
    v-model="clearSpeakerDialog"
    max-width="400">
      <v-card>
        <v-card-title class="headline">Vas a quitar el orador activo</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn left color="red darken-1" flat="flat" @click.native="clearActiveSpeaker">Eliminar</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="clearSpeakerDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
    color="secondary"
    block
    @click="clearSpeakerDialog = true"
    >
    Quitar orador activo
  </v-btn>
    <v-dialog class="align-right" v-model="manageModeratorsDialog">
    <v-card>
      <v-card-title>
        Manage mods
      </v-card-title>
      <v-card-text>
        <v-list subheader>
          <v-subheader>Select the admins</v-subheader>

          <v-list-tile
            v-for="(participant, uid) in participants"
            :key="uid"
            avatar
            @click="toggleAdmin(participant, uid)"
          >
            <v-list-tile-avatar>
              <img :src="participant.photo">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-html="participant.displayName"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon :color="participant.isAdmin ? 'teal' : 'grey'">gavel</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-btn
  @click.stop="manageModeratorsDialog = true"
  color="secondary"
  block
  >
    Administrar moderadores
  </v-btn>
  </div>
  <create-votation></create-votation>
  <v-btn
    color="secondary"
    block
    @click="toggleVotationActiveState"
    v-if="room.votation"
  >
    {{ room.votation.isActive ? 'Cerrar respuestas de la votación actual' : 'Abrir respuestas de la votación actual' }}
  </v-btn>

  <label for="minutos">Cronómetro en minutos</label><br>
  <input type="number" v-model="minutos" class="minutos" name="minutos" id="" placeholder="Ingrese la duracion del discurso">
</v-flex>
</template>

<script>
import { rooms } from '../firebase'
import CreateVotation from '../components/CreateVotation.vue'
import firebase from 'firebase'
export default {
  data () {
    return {
      minutos: 20,
      nextSpeakerDialog: false,
      clearSpeakerDialog: false,
      manageModeratorsDialog: false,
      nextSpeakerCandidate: {},
      speakersList: [],
      participants: [],
      interpellatorsList: [],
      room: null
    }
  },
  components: {
    CreateVotation
  },
  created () {
    firebase.database().ref(`/status/${this.$route.params.id}`)
    .on('value', snapshot => {
      this.participants = snapshot.val()
    })
  },
  // firebase: {
  //   speakersList,
  //   interpelations,
  //   speaking
  // },
  firestore () {
    return {
      room: rooms.doc(this.$route.params.id),
      speakersList: rooms.doc(this.$route.params.id).collection('speakersList').orderBy('timestamp'),
      interpellatorsList: rooms.doc(this.$route.params.id).collection('interpellatorsList')
    }
  },
  methods: {
    remove (item) {
      const index = this.friends.indexOf(item.name)
      if (index >= 0) this.friends.splice(index, 1)
    },
    setAsSpeaker (user) {
      rooms.doc(this.$route.params.id).update({
        speaking: {
          name: user.name,
          uid: user.uid,
          photo: user.photo,
          time: this.minutos,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
      }).then(
        res => {
          this.removeSpeaker(user.uid)
          this.nextSpeakerDialog = false
        }
      )
    },
    toggleQuestions (enabled) {
      rooms.doc(this.$route.params.id).update({canInterpelate: !this.room.canInterpelate})
    },
    removeSpeaker (userUid) {
      rooms.doc(this.$route.params.id)
      .collection('speakersList')
      .doc(userUid)
      .delete()
    },
    removeQuestion (userUid) {
      rooms.doc(this.$route.params.id)
      .collection('interpellatorsList')
      .doc(userUid)
      .delete()
    },
    toggleAdmin (participant, uid) {
      // if (this.participants.filter(participant => participant.isAdmin).length === 1 &&
      //     participant.isAdmin) return
      const admins = this._getAdmins()
      if (admins.length === 1 && participant.isAdmin) return
      firebase.database().ref(`/status/${this.$route.params.id}/${uid}`).update({isAdmin: !participant.isAdmin})
    },
    _getAdmins () {
      return Object.values(this.participants)
        .filter(participant => participant.isAdmin)
    },
    setNewSpeakerDialog (user) {
      console.log(user)
      this.nextSpeakerCandidate = user
      this.nextSpeakerDialog = !this.nextSpeakerDialog
    },
    toggleVotationActiveState () {
      this.room.votation.isActive = !this.room.votation.isActive
      rooms.doc(this.$route.params.id).update({votation: this.room.votation})
    },
    clearActiveSpeaker () {
      this.room.speaking = null
      rooms.doc(this.$route.params.id).update({
        speaking: null
      }).then(res => {
        this.clearSpeakerDialog = false
      })
    }
  }
}
</script>

<style>
.minutos {
  border: 1px solid orange;
}
</style>
