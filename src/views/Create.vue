<template>
  <v-flex xs12 lg4>
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="roomName"
        :rules="roomNameRules"
        :counter="25"
        label="Nombre de la sala"
        required
      ></v-text-field>
      <v-text-field
        v-model="roomDescription"
        :rules="roomDescriptionRules"
        :counter="140"
        label="Descripción de la sala"
        required
      ></v-text-field>
      <v-btn
          :disabled="!valid"
          @click="submit"
        >
          Crear sala
      </v-btn>
    </v-form>
  </v-flex>
</template>

<script>
import { rooms } from '../firebase'
import firebase from 'firebase'
export default {
  data () {
    return {
      rooms: [],
      valid: false,
      roomName: '',
      roomNameRules: [
        v => !!v || 'Nombre requerido',
        v => v.length >= 6 || 'El nombre de la sala debe tener 6 caracteres o mas',
        v => v.length <= 25 || 'El nombre de la sala debe tener menos de 25 caracteres'
      ],
      roomDescription: '',
      roomDescriptionRules: [
        v => !!v || 'Descripcion requerida',
        v => v.length >= 10 || 'La descripción debe tener al menos 10 caracteres',
        v => v.length <= 140 || 'La descripción debe tener menos de 140 caracteres'
      ]
    }
  },
  firestore () {
    return {
      rooms
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        rooms.add({
          name: this.roomName,
          description: this.roomDescription,
          moderatorsUID: [firebase.auth().currentUser.uid],
          speaking: null,
          canInterpelate: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(room => {
          firebase.database().ref(`/status/${room.id}/${firebase.auth().currentUser.uid}`).child('isAdmin').set(true)
          this.$router.push(`/room/${room.id}`)
        })
      }
    }
  }
}
</script>

<style>

</style>
