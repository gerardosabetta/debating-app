import firebase from 'firebase'

export function debateLog (roomId, message) {
  firebase.firestore().doc('/rooms/' + roomId).collection('logs').add({
    message
  })
}
