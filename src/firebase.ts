// /lib/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInAnonymously
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAt_KdniRFD0gxXsZeQhNCSwPsD4aANy9k",
    authDomain: "siuroma-kids-dev.firebaseapp.com",
    projectId: "siuroma-kids-dev",
    storageBucket: "siuroma-kids-dev.firebasestorage.app",
    messagingSenderId: "171300244666",
    appId: "1:171300244666:web:ceb4f83aaf9986205ec683",
    measurementId: "G-V5WFZGHPRR"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export {
  auth,
  signInWithEmailAndPassword,
  signInWithGoogle,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInAnonymously,
};