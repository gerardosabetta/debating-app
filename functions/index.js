const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Since this code will be running in the Cloud Functions enviornment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.
exports.onUserStatusChanged = functions.database.ref('/status/{room}/{uid}').onUpdate(
  (change, context) => {
    // Get the data written to Realtime Database
    const changeValue = change.after.val();
    const { room, uid } = context.params
    // Then use other event data to create a reference to the
    // corresponding Firestore document.
    const userStatusFirestoreRef = firestore.doc(`rooms/${room}/participants/${uid}`);

    // It is likely that the Realtime Database change that triggered
    // this event has already been overwritten by a fast change in
    // online / offline status, so we'll re-read the current data
    // and compare the timestamps.
    return change.after.ref.once('value').then((statusSnapshot) => {
      const status = statusSnapshot.val();
      console.log(status, changeValue)
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > changeValue.last_changed) {
        return null;
      }

      // Otherwise, we convert the last_changed field to a Date
      changeValue.last_changed = new Date(changeValue.last_changed);

      // ... and write it to Firestore.
      return userStatusFirestoreRef.set(changeValue);
    });
  });
