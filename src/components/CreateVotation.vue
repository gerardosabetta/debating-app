<template>
  <div>
    <v-dialog width="500" class="full-width" v-model="voteDialog">
      <v-btn slot="activator" color="red lighten-2" dark block>
        Iniciar votacion
      </v-btn>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Creando nueva votación
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="voteSettings.title" label="Título de la votación" required></v-text-field>
          <v-text-field v-model="voteSettings.text" label="Descripción de la votación" required></v-text-field>

          <section v-for="(option, index) in voteSettings.options" :key="index">
            <v-layout row wrap>
              <v-flex xs11>
                <v-text-field v-model="option.title" :label="'Opción ' + (index + 1)" required></v-text-field>
              </v-flex>
              <v-flex xs1 align-center justify-end>
                <v-btn v-if="index !== 0 && index !== 1" flat icon color="red" @click="removeOption(index)">
                  <v-icon>remove</v-icon>
                </v-btn>
              </v-flex>
              <v-btn v-if="index === voteSettings.options.length - 1 && option.title.length" flat icon color="green" @click="addOption()">
                <v-icon>add</v-icon>
              </v-btn>
            </v-layout>
          </section>
          <v-checkbox label="Votos anonimos" v-model="voteSettings.isAnon"></v-checkbox>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red" flat @click="voteDialog = false">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="initVotation()">
            Iniciar votación
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { rooms } from '../firebase'

export default {
  data () {
    return {
      voteDialog: false,
      voteSettings: {
        title: '',
        text: '',
        options: [
          { title: '' },
          { title: '' }
        ],
        isAnon: false,
        isActive: true
      }
    }
  },
  methods: {
    initVotation () {
      rooms.doc(this.$route.params.id).update({
        votation: this.voteSettings
      }).then(data => {
        this.title = ''
        this.text = ''
        this.options = [
          { title: '' },
          { title: '' }
        ]
        this.voteDialog = false
      })
    },
    addOption () {
      this.voteSettings.options.push({
        title: ''
      })
    },
    removeOption (index) {
      this.voteSettings.options.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
