import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/views/Auth'
import Moderator from '@/views/Moderator'
import DebateInstance from '@/views/DebateInstance'
import VotationDetails from '@/views/VotationDetails'
import Dashboard from '@/views/Dashboard'
import Create from '@/views/Create'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/create',
      name: 'Create',
      component: Create,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/room/:id',
      name: 'Sala de debate',
      component: DebateInstance,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/room/:id/votation',
      name: 'Votación',
      component: VotationDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/mod/:id',
      name: 'Mod',
      component: Moderator,
      meta: {
        requiresAuth: true,
        requiresToBeTheCreatorOfTheRoom: true
      }
    }
  ]
})

router.beforeEach(async(to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let requiresToBeTheCreatorOfTheRoom = to.matched.some(record => record.meta.requiresToBeTheCreatorOfTheRoom)
  if (requiresToBeTheCreatorOfTheRoom) {
    let creatorUid = await getCreatorUid(to.params.id)
    if (requiresToBeTheCreatorOfTheRoom && creatorUid !== currentUser.uid) next('/')
  }

  if (requiresAuth && !currentUser) next('auth')
  else if (!requiresAuth && currentUser) next('/')
  else next()
})

function getCreatorUid (roomId) {
  return firebase.firestore().collection('rooms').doc(roomId).get().then(res => res.data().createdBy)
}

export default router
