import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAFIbbt-wNOkvpBLj6If2WZfXet9hRpzyE",
  authDomain: "preventive-tcc.firebaseapp.com",
  projectId: "preventive-tcc",
  storageBucket: "preventive-tcc.firebasestorage.app",
  messagingSenderId: "99905694626",
  appId: "1:99905694626:web:c89231e9c31544f2d7e0fb"
};

const app = initializeApp(firebaseConfig);


let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };