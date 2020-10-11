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
        requiresAuth: true
      },
      beforeEnter: requiresToBeModGuard
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUser) {
    next('auth')
  }
  next()
})

async function requiresToBeModGuard (to, from, next) {
  console.log('current user gg', await currentUserIsMod(to.params.id))
  if (await currentUserIsMod((to.params.id))) next()
  else next('/')
}

async function currentUserIsMod (roomId) {
  const currentUser = firebase.auth().currentUser
  const res = await firebase.database()
    .ref(`/status/${roomId}/${currentUser.uid}`)
    .once('value').then(snapshot => snapshot.val().isAdmin)
  return res
}

export default router
