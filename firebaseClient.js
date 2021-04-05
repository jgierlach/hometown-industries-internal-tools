import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTqAwYIjo0_ak7_dTYGEyhjoun1mRdiB0",
  authDomain: "ht-internal-tools.firebaseapp.com",
  projectId: "ht-internal-tools",
  storageBucket: "ht-internal-tools.appspot.com",
  messagingSenderId: "56722582514",
  appId: "1:56722582514:web:f35c1031cd7254ee1e196b",
  measurementId: "G-437XWZRH4V"
};

export default function firebaseClient() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
}
