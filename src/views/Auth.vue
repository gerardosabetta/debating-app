<template>
<div>
    <h2>Por favor identificate para formar parte del debate</h2>
  <div id="firebaseui-auth-container">

  </div>
</div>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'
// import { config } from '../firebase'
export default {
  name: 'auth',
  mounted () {
    let uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ]
    }

    let ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>

<style>

</style>
