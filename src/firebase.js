import * as firebase from 'firebase'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyD2IHV5tojxIeBYiMjRUYQeTP1EJZXRSUE',
  authDomain: 'debatebasico.firebaseapp.com',
  databaseURL: 'https://debatebasico.firebaseio.com',
  projectId: 'debatebasico',
  storageBucket: 'debatebasico.appspot.com',
  messagingSenderId: '491658904266'
}

firebase.initializeApp(config)

const db = firebase.firestore()
// export const speakersList = db.ref('speakersList') // deprecated
// export const interpelations = db.ref('interpelations') // deprecated
// export const speakingArray = db.ref('speaking') // deprecated
export const rooms = db.collection('rooms')
export const sortedRoomsByCreatedDate = db.collection('rooms').orderBy('createdAt')
// export const speaking = {
//   source: db.ref('speaking'),
//   asObject: true
// }
