// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import firebase from 'firebase'
import './firebase'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import Vuetify from 'vuetify'
import _ from 'lodash'
const moment = require('moment')
require('moment/locale/es')

// import firebase from 'firebase'
// import firebaseui from 'firebaseui'
import('vuetify/dist/vuetify.min.css')
import('firebaseui/dist/firebaseui.css')
Vue.use(VueFire)
Vue.use(Vuetify)
Vue.use(require('vue-moment'), {
  moment
})

Vue.set(Vue.prototype, '_', _)

Vue.config.productionTip = false
let app
firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  }
})
