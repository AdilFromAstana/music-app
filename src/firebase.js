import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmP2wIoUAJzRM2HN9hXjtB2R3bKi_HxcM",
  authDomain: "music-school-e9b92.firebaseapp.com",
  projectId: "music-school-e9b92",
  storageBucket: "music-school-e9b92.firebasestorage.app",
  messagingSenderId: "979984365304",
  appId: "1:979984365304:web:5ed1ae5c85f188fe5c6d0d",
  measurementId: "G-4YFQ33LBFW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export async function getComposers(pageSize = 5, lastVisible = null) {
  let composersQuery = query(
    collection(db, "composers"),
    orderBy("description"), // Сортировка (можно поменять на другое поле)
    limit(pageSize)
  );

  // Если есть последний документ, начинаем после него
  if (lastVisible) {
    composersQuery = query(composersQuery, startAfter(lastVisible));
  }

  try {
    const snapshot = await getDocs(composersQuery);
    const composers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // Сохраняем последний документ для пагинации

    return { composers, lastDoc };
  } catch (error) {
    console.error("Error fetching composers:", error);
  }
}

export async function updateComposer(docId, updateFields) {
  const docRef = doc(db, "composers", docId);

  try {
    await updateDoc(docRef, updateFields);
    console.log("Document updated successfully!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}
