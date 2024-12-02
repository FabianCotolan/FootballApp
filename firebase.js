import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCkXD2OgOlpJf3e6mnKbDnOAODRsl64FZw",
    authDomain: "footballapp-3ffd6.firebaseapp.com",
    projectId: "footballapp-3ffd6",
    storageBucket: "footballapp-3ffd6.firebasestorage.app",
    messagingSenderId: "61331905832",
    appId: "1:61331905832:web:e60e469a5c88a4be07041d",
    measurementId: "G-QWC88SH9MQ"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
