// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-8ff31.firebaseapp.com",
  projectId: "mern-real-estate-8ff31",
  storageBucket: "mern-real-estate-8ff31.appspot.com",
  messagingSenderId: "124180158905",
  appId: "1:124180158905:web:12e8841811a2853aeffe68",
  measurementId: "G-JM0BF6BSGY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
