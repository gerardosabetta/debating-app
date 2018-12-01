import * as firebase from 'firebase'
import 'firebase/firestore'

import { config } from './.firebaseconfig'

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
