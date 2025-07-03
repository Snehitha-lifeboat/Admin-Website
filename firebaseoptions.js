// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCVbKs1S-QLFSXBIvVTsf2D_YMLoCMNtg",
  authDomain: "lifeboat-admin.firebaseapp.com",
  projectId: "lifeboat-admin",
  storageBucket: "lifeboat-admin.firebasestorage.app",
  messagingSenderId: "913390627402",
  appId: "1:913390627402:web:bee426eaf72237d1d054b3",
  measurementId: "G-DKVCPWZBJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
 const auth = getAuth(app);
 const storage = getStorage(app); 
 export { db ,storage};