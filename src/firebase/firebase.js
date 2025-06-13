import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSKG4HTK0TVLZYy0wYtyZfTu2Dsv4rQMs",
  authDomain: "test-backend-fbf6b.firebaseapp.com",
  databaseURL:
    "https://test-backend-fbf6b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-backend-fbf6b",
  storageBucket: "test-backend-fbf6b.appspot.com",
  messagingSenderId: "332032628708",
  appId: "1:332032628708:web:a999e6175540817a74d9f1",
  measurementId: "G-J69K1WK6GJ",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
