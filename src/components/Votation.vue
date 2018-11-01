<template>
  <div>
    <v-dialog class="full-width" v-model="dialog" width="100%">
      <v-btn
        slot="activator"
        color="secondary"
        block
        dark
      >
        Participar en la votación
      </v-btn>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ votationInfo.title }}
        </v-card-title>
        <v-card-text>
          {{ votationInfo.text }}
          <v-radio-group v-model="selectedOption">
            <v-radio
              v-for="(option, index) of votationInfo.options" :key="index"
              :label="option.title"
              :value="option.title"
            ></v-radio>
          </v-radio-group>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!selectedOption" flat @click="emitVote">
            Votar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { rooms } from '../firebase'
import firebase from 'firebase'

export default {
  props: ['votationInfo'],
  data () {
    return {
      dialog: false,
      selectedOption: ''
    }
  },
  methods: {
    emitVote () {
      let userInfo = firebase.auth().currentUser
      rooms.doc(this.$route.params.id).collection('votes').doc(userInfo.uid)
      .set({
        votedOption: this.selectedOption,
        userInfo: {
          displayName: userInfo.displayName,
          photoUrl: userInfo.photoURL
        }
      }).then(() => {
        this.dialog = false
        this.$router.push({ path: `/room/${this.$route.params.id}/votation` })
      })
    }
  }
}
</script>

<style scoped>
 .full-width {
   width: 100%;
 }
</style>
