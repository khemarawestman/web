
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
//min firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA1UqgszmVXrTnAWQHCpeY4JlInlU4fNRo",
    authDomain: "movie-ec0ce.firebaseapp.com",
    databaseURL: "https://movie-ec0ce-default-rtdb.firebaseio.com",
    projectId: "movie-ec0ce",
    storageBucket: "movie-ec0ce.appspot.com",
    messagingSenderId: "186450913388",
    appId: "1:186450913388:web:af4e7ac662565b75031049",
    measurementId: "G-ZP2B72Y86G"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
