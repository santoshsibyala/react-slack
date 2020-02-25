import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import '@firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCBiEAq77PeeShN0-zFV1BRrTwYpxqa__U",
    authDomain: "slack-cole.firebaseapp.com",
    databaseURL: "https://slack-cole.firebaseio.com",
    projectId: "slack-cole",
    storageBucket: "slack-cole.appspot.com",
    messagingSenderId: "72646649372",
    appId: "1:72646649372:web:9ae9a6412de944a6e8e1d9"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;