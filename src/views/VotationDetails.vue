<template>
  <v-flex xs12 lg4>
    <div v-if="room && room.votation && room.votation.options && votes">
      <Vote-results :chartData="votationData"></Vote-results>
      <v-list v-if="!room.votation.isAnon">
        <v-subheader>Los votos</v-subheader>
        <v-list-group v-for="(option, index) in voteOptions" :key="index">
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title> {{ option }} ({{votesArray[index]}}) </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile avatar v-for="(vote, index) in votes" :key="index" v-if="vote.votedOption === option">
            <v-list-tile-avatar>
              <img :src="vote.userInfo.photoUrl" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="vote.userInfo.displayName"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </div>
    <div v-else>
      No hay información para mostrar
    </div>
  </v-flex>
</template>

<script>
import { rooms } from '../firebase'
import VoteResults from '../components/VoteResults'

export default {
  components: {
    VoteResults
  },
  data () {
    return {
      room: null,
      votes: []
    }
  },
  firestore () {
    return {
      room: rooms.doc(this.$route.params.id),
      votes: rooms.doc(this.$route.params.id).collection('votes')
    }
  },
  computed: {
    votesArray: function () {
      // TODO: Refactorizar esta verga
      return this.room.votation.options.map(option => {
        return this.votes.filter(vote => {
          return vote.votedOption === option.title
        }).length
      })
    },
    voteOptions: function () {
      return this.room.votation.options.map(option => option.title)
    },
    votationData: function () {
      return {
        labels: this.voteOptions,
        datasets: [{
          label: 'Resultados de la votación',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          data: this.votesArray
        }]
      }
    }
  }
}
</script>
